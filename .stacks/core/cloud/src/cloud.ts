/* eslint-disable no-new */
import type { Construct } from 'constructs'
import type { StackProps } from 'aws-cdk-lib'
import {
  Duration,
  CfnOutput as Output,
  RemovalPolicy,
  Stack,
  aws_certificatemanager as acm,
  aws_cloudfront as cloudfront,
  aws_lambda as lambda,
  aws_cloudfront_origins as origins,
  aws_route53 as route53,
  aws_s3 as s3,
  aws_s3_deployment as s3deploy,
  aws_route53_targets as targets,
  aws_wafv2 as wafv2,
} from 'aws-cdk-lib'
import { hasFiles } from '@stacksjs/storage'
import { path as p } from '@stacksjs/path'
import { app, cloud } from '@stacksjs/config'
import { env } from '@stacksjs/env'

export class StacksCloud extends Stack {
  domain: string
  apiDomain: string

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    if (!app.url)
      throw new Error('./config app.url is not defined')

    this.domain = app.url
    this.apiDomain = `${app.subdomains?.api || 'api'}.${app.url}`

    const zone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: this.domain,
    })

    const certificate = new acm.Certificate(this, 'WebsiteCertificate', {
      domainName: this.domain,
      validation: acm.CertificateValidation.fromDns(zone),
    })

    const publicBucket = new s3.Bucket(this, 'PublicBucket', {
      bucketName: `${this.domain}-${app.env}`,
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    const privateBucket = new s3.Bucket(this, 'PrivateBucket', {
      bucketName: `${this.domain}-private-${app.env}`,
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    // Create an S3 bucket for CloudFront access logs
    let logBucket: s3.Bucket | undefined

    if (cloud.cdn?.enableLogging) {
      logBucket = new s3.Bucket(this, 'LogBucket', {
        bucketName: `${this.domain}-logs-${app.env}`,
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
      })
    }

    // Create WAF WebAcl
    const webAcl = new wafv2.CfnWebACL(this, 'WebAcl', {
      scope: 'CLOUDFRONT',
      defaultAction: { allow: {} }, // Default action is to allow requests
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'webAclMetric',
      },
      // rules: security.appFirewall?.rules,
    })

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OAI')

    const customCdnCachePolicy = new cloudfront.CachePolicy(this, 'CustomCdnCachePolicy', {
      comment: 'Custom Stacks CDN Cache Policy',
      cachePolicyName: 'CustomCdnCachePolicy',
      minTtl: cloud.cdn?.minTtl ? Duration.seconds(cloud.cdn.minTtl) : undefined,
      defaultTtl: cloud.cdn?.defaultTtl ? Duration.seconds(cloud.cdn.defaultTtl) : undefined,
      maxTtl: cloud.cdn?.maxTtl ? Duration.seconds(cloud.cdn.maxTtl) : undefined,
      cookieBehavior: getCookieBehavior(cloud.cdn?.cookieBehavior),
    })

    // create a CDN to deploy your website
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      domainNames: [this.domain],
      defaultRootObject: 'index.html',
      comment: `CDN for ${app.url}`,
      certificate,
      enableLogging: cloud.cdn?.enableLogging,
      logBucket: cloud.cdn?.enableLogging ? logBucket : undefined,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      enabled: true,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      webAclId: webAcl.attrArn,
      enableIpv6: true,

      defaultBehavior: {
        origin: new origins.S3Origin(publicBucket, {
          originAccessIdentity,
          originShieldRegion: cloud.cdn?.originShieldRegion,
        }),
        compress: cloud.cdn?.compress,
        allowedMethods: cloud.cdn?.allowedMethods
          ? allowedMethodsFromString(cloud.cdn.allowedMethods)
          : cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloud.cdn?.cachedMethods
          ? allowedMethodsFromString(cloud.cdn.cachedMethods)
          : cloudfront.CachedMethods.CACHE_GET_HEAD,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: customCdnCachePolicy,
      },

      // errorResponses: [
      //   {
      //     httpStatus: 403,
      //     responsePagePath: '/index.html',
      //     responseHttpStatus: 200,
      //     ttl: cdk.Duration.minutes(0),
      //   },
      //   {
      //     httpStatus: 404,
      //     responsePagePath: '/index.html',
      //     responseHttpStatus: 200,
      //     ttl: cdk.Duration.minutes(0),
      //   },
      // ],
    })

    // Create a Route53 record pointing to the CloudFront distribution
    new route53.ARecord(this, 'AliasRecord', {
      recordName: this.domain,
      zone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    })

    new route53.CnameRecord(this, 'WwwCnameRecord', {
      zone,
      recordName: 'www',
      domainName: this.domain,
    })

    const docsSource = '../../../storage/framework/docs'
    const websiteSource = app.docMode ? docsSource : '../../../storage/public'
    const privateSource = '../../../storage/private'

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(websiteSource)],
      destinationBucket: publicBucket,
      distribution,
      distributionPaths: ['/*'],
    })

    new s3deploy.BucketDeployment(this, 'DeployPrivateFiles', {
      sources: [s3deploy.Source.asset(privateSource)],
      destinationBucket: privateBucket,
    })

    if (shouldDeployApi())
      this.deployApi(zone, originAccessIdentity, webAcl, logBucket)

    if (shouldDeployDocs())
      this.deployDocs(zone, originAccessIdentity, webAcl, docsSource, logBucket)

    // Prints out the web endpoint to the terminal
    new Output(this, 'AppUrl', {
      value: `https://${this.domain}`,
      description: 'The URL of the deployed application',
    })

    // Prints out the web endpoint to the terminal
    new Output(this, 'VanityUrl', {
      value: `https://${distribution.domainName}`,
      description: 'The vanity URL of the deployed application',
    })

    // Output the nameservers of the hosted zone
    // new Output(this, 'Nameservers', {
    //   value: Fn.join(', ', zone.hostedZoneNameServers),
    //   description: 'Nameservers for the application domain',
    // })
  }

  async deployDocs(
    zone: route53.PublicHostedZone,
    originAccessIdentity: cloudfront.OriginAccessIdentity,
    webAcl: wafv2.CfnWebACL,
    docsSource: string,
    logBucket?: s3.Bucket,
  ) {
    const docsCertificate = new acm.Certificate(this, 'DocsCertificate', {
      domainName: `${app.subdomains?.docs}.${this.domain}`,
      validation: acm.CertificateValidation.fromDns(zone),
    })

    const docsBucket = new s3.Bucket(this, 'DocsBucket', {
      bucketName: `docs.${this.domain}-${app.env}`,
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    if (logBucket) {
      logBucket.addLifecycleRule({
        enabled: true,
        expiration: Duration.days(30), // TODO: make this configurable
        id: 'rule',
      })
    }

    const docsDistribution = new cloudfront.Distribution(this, 'DocsDistribution', {
      domainNames: [`${app.subdomains?.docs}.${app.url}`],
      defaultRootObject: 'index.html',
      comment: `CDN for ${app.subdomains?.docs}.${app.url}`,
      certificate: docsCertificate,
      // originShieldEnabled: true,
      enableLogging: true,
      logBucket,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      enabled: true,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      webAclId: webAcl.attrArn,
      enableIpv6: true,

      defaultBehavior: {
        origin: new origins.S3Origin(docsBucket, {
          originAccessIdentity,
        }),
        compress: true,
        allowedMethods: allowedMethodsFromString(cloud.cdn?.allowedMethods),
        cachedMethods: cachedMethodsFromString(cloud.cdn?.cachedMethods),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },

      // errorResponses: [
      //   {
      //     httpStatus: 403,
      //     responsePagePath: '/index.html',
      //     responseHttpStatus: 200,
      //     ttl: cdk.Duration.minutes(0),
      //   },
      //   {
      //     httpStatus: 404,
      //     responsePagePath: '/index.html',
      //     responseHttpStatus: 200,
      //     ttl: cdk.Duration.minutes(0),
      //   },
      // ],
    })
    // Create a Route53 record pointing to the Docs CloudFront distribution
    new route53.ARecord(this, 'DocsAliasRecord', {
      recordName: `${app.subdomains?.docs}.${this.domain}`,
      zone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(docsDistribution)),
    })

    new s3deploy.BucketDeployment(this, 'DeployDocs', {
      sources: [s3deploy.Source.asset(docsSource)],
      destinationBucket: docsBucket,
      distribution: docsDistribution,
      distributionPaths: ['/*'],
    })

    // new Output(this, 'DocsBucketName', {
    //   value: docsBucket.bucketName,
    //   description: 'The name of the docs bucket',
    // })

    // Prints out the web endpoint to the terminal
    new Output(this, 'DocsUrl', {
      value: `https://${app.subdomains?.docs}.${app.url}`,
      description: 'The URL of the deployed documentation',
    })
  }

  async deployApi(
    zone: route53.HostedZone,
    originAccessIdentity: cloudfront.OriginAccessIdentity,
    webAcl: wafv2.CfnWebACL,
    logBucket?: s3.Bucket
  ) {
    const apiCertificate = new acm.Certificate(this, 'ApiCertificate', {
      domainName: `${app.subdomains?.api}.${this.domain}`,
      validation: acm.CertificateValidation.fromDns(zone),
    })

    const layer = new lambda.LayerVersion(this, 'StacksLambdaLayer', {
      code: lambda.Code.fromAsset(p.projectStoragePath('framework/cloud/bun-lambda-layer.zip')),
      compatibleRuntimes: [lambda.Runtime.PROVIDED_AL2],
      compatibleArchitectures: [lambda.Architecture.ARM_64],
      license: 'MIT',
      description: 'Bun is an incredibly fast JavaScript runtime, bundler, transpiler, and package manager.',
    })

    // const filteredEnv = Object.fromEntries(
    //   Object.entries(env)
    //     .filter(([key, value]) => key.startsWith('STACKS_') && value !== undefined)
    // )

    const stacksServerFunction = new lambda.Function(this, 'StacksServer', {
      description: 'The Stacks API',
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        TEST_ENV: 'test',
      },
      code: lambda.Code.fromAsset(p.projectStoragePath('framework/api/lambda.zip')),
      handler: 'index.handler',
      runtime: lambda.Runtime.PROVIDED_AL2,
      layers: [layer],
    })

    const apiUrl = new lambda.FunctionUrl(this, 'StacksServerUrl', {
      function: stacksServerFunction,
      authType: lambda.FunctionUrlAuthType.NONE, // becomes a public API
      cors: {
        allowedOrigins: ['*'],
      },
      // url: `https://${this.domain}/api`,
      // path: 'api',
      // domainName: this.domain,
      // zone,
    })

    const customApiCachePolicy = new cloudfront.CachePolicy(this, 'StacksApiCachePolicy', {
      comment: 'Custom Stacks API Cache Policy',
      cachePolicyName: 'StacksApiCachePolicy',
      // minTtl: cloud.cdn?.minTtl ? Duration.seconds(cloud.cdn.minTtl) : undefined,
      defaultTtl: Duration.seconds(0),
      cookieBehavior: getCookieBehavior(cloud.cdn?.cookieBehavior),
    })

    const originRequestPolicy = new cloudfront.OriginRequestPolicy(this, 'StacksApiOriginRequestPolicy', {
      originRequestPolicyName: 'StacksApiOriginRequestPolicy',
      comment: 'A custom origin request policy for the Stacks API',
      cookieBehavior: cloudfront.OriginRequestCookieBehavior.none(),
      headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList('Accept', 'x-api-key', 'Authorization'),
      queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.none(),
    });

    // create a CDN to deploy your website
    const apiDistribution = new cloudfront.Distribution(this, 'Distribution', {
      domainNames: [this.apiDomain],
      comment: `Stacks API Distribution for ${this.apiDomain}`,
      certificate: apiCertificate,
      enableLogging: cloud.cdn?.enableLogging,
      logBucket: cloud.cdn?.enableLogging ? logBucket : undefined,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      enabled: true,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      webAclId: webAcl.attrArn,
      enableIpv6: true,

      defaultBehavior: {
        origin: new origins.HttpOrigin(apiUrl.url, {
          originPath: '/',
          originShieldRegion: cloud.cdn?.originShieldRegion,
        }),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        cachePolicy: customApiCachePolicy,
        originRequestPolicy,
      },

      // errorResponses: [
      //   {
      //     httpStatus: 403,
      //     responsePagePath: '/index.html',
      //     responseHttpStatus: 200,
      //     ttl: cdk.Duration.minutes(0),
      //   },
      //   {
      //     httpStatus: 404,
      //     responsePagePath: '/index.html',
      //     responseHttpStatus: 200,
      //     ttl: cdk.Duration.minutes(0),
      //   },
      // ],
    })

    new route53.ARecord(this, 'AliasRecord', {
      recordName: this.apiDomain,
      zone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(apiDistribution)),
    })

    new Output(this, 'ServerVanityUrl', {
      value: apiUrl.url,
      // value: `https://api.${this.domain}`,
      description: 'The URL of the deployed Stacks server.',
    })
  }
}

function shouldDeployDocs() {
  return hasFiles(p.projectPath('docs'))
}

function shouldDeployApi() {
  return cloud.deploy?.api
}

function allowedMethodsFromString(methods?: 'ALL' | 'GET_HEAD' | 'GET_HEAD_OPTIONS'): cloudfront.AllowedMethods {
  if (!methods)
    return cloudfront.AllowedMethods.ALLOW_ALL

  switch (methods) {
    case 'ALL':
      return cloudfront.AllowedMethods.ALLOW_ALL
    case 'GET_HEAD':
      return cloudfront.AllowedMethods.ALLOW_GET_HEAD
    case 'GET_HEAD_OPTIONS':
      return cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS
    default:
      return cloudfront.AllowedMethods.ALLOW_ALL
  }
}

function cachedMethodsFromString(methods?: 'GET_HEAD' | 'GET_HEAD_OPTIONS'): cloudfront.CachedMethods {
  if (!methods)
    return cloudfront.CachedMethods.CACHE_GET_HEAD

  switch (methods) {
    case 'GET_HEAD':
      return cloudfront.CachedMethods.CACHE_GET_HEAD
    case 'GET_HEAD_OPTIONS':
      return cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS
    default:
      return cloudfront.CachedMethods.CACHE_GET_HEAD
  }
}

function getCookieBehavior(behavior: string | undefined): cloudfront.CacheCookieBehavior | undefined {
  switch (behavior) {
    case 'all':
      return cloudfront.CacheCookieBehavior.all()
    case 'none':
      return cloudfront.CacheCookieBehavior.none()
    case 'allowList':
      // If you have a list of cookies, replace `myCookie` with your cookie
      return cloudfront.CacheCookieBehavior.allowList(...cloud.cdn?.allowList.cookies || [])
    default:
      return undefined
  }
}
