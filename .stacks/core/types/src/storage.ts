export interface StorageOptions {
  /**
   * **Storage Driver**
   *
   * The storage driver to utilize.
   *
   * @default string 's3'
   * @see https://stacksjs.dev/docs/storage
   */
  driver: 's3' | 'efs' | 'local'
}

export type StorageConfig = Partial<StorageOptions>
