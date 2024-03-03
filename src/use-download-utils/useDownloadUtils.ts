// file: src/use-download-utils/useDownloadUtils.ts

export interface IMimeTypes {
  json: string
  text: string
  image: string
}

export interface IDownloadUtils {
  mimeTypes: IMimeTypes
  downloadBlob(fileName: string, blob: Blob): Promise<boolean>
  download(fileName: string, mimeType: string, dataStr: string): Promise<boolean>
}

let _downloadUtils!: IDownloadUtils

export const useDownloadUtils = () => {
  if (!_downloadUtils) {
    _downloadUtils = {
      mimeTypes: {
        json: 'application/json;charset=utf-8;',
        text: 'text/plain;charset=utf-8;',
        image: 'application/octet-stream;'
      },
      downloadBlob: async (fileName: string, blob: Blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        if (link.download !== undefined) {
          link.style.visibility = 'hidden'
          link.setAttribute('href', url)
          link.setAttribute('download', fileName)
          link.click()
        }
        link.remove()
        return true
      },
      download: async (fileName: string, mimeType: string, dataStr: string) => {
        const defaultFileName = 'data.json'
        const blob = new Blob([dataStr], { type: mimeType })
        return await _downloadUtils.downloadBlob((fileName || defaultFileName).trim(), blob)
      }
    }
  }
  return _downloadUtils
}
