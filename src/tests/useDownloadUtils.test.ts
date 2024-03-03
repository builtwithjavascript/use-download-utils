import { useDownloadUtils } from '@/use-download-utils/'
// @ts-ignore
import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock global objects and functions
beforeEach(() => {
  global.URL.createObjectURL = vi.fn(() => 'mock-url')

  // Adjusted mock for createElement
  /* @ts-ignore */
  document.createElement = vi.fn((tagName: string) => ({
    click: vi.fn(),
    setAttribute: vi.fn(),
    style: { visibility: 'hidden' },
    download: '',
    href: ''
    // Add other properties and methods as needed
  })) as any // Casting to `any` to bypass TypeScript's strict type checks

  document.removeChild = vi.fn()
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('useDownloadUtils', () => {
  it('Should return instance', () => {
    const instance = useDownloadUtils()
    expect(instance).toBeDefined()
  })

  it('should have correct MIME types', () => {
    const { mimeTypes } = useDownloadUtils()
    expect(mimeTypes).toEqual({
      json: 'application/json;charset=utf-8;',
      text: 'text/plain;charset=utf-8;',
      image: 'application/octet-stream;'
    })
  })

  it('downloadBlob should create a link, set attributes, and simulate a click', async () => {
    const { downloadBlob } = useDownloadUtils()
    const fileName = 'test.txt'
    const blob = new Blob(['test'], { type: 'text/plain;charset=utf-8;' })

    // Create a mock anchor element and reuse it
    const mockAnchorElement = {
      click: vi.fn(),
      setAttribute: vi.fn(),
      style: { visibility: 'hidden' },
      download: '' // Add this to satisfy the if condition in downloadBlob
    }

    // Mock document.createElement to always return this mock anchor element
    document.createElement = vi.fn(() => mockAnchorElement) as any

    const result = await downloadBlob(fileName, blob)

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob)
    expect(document.createElement).toHaveBeenCalledWith('a')
    // Now, these assertions refer to the same mock element
    expect(mockAnchorElement.setAttribute).toHaveBeenCalledWith('href', expect.any(String))
    expect(mockAnchorElement.setAttribute).toHaveBeenCalledWith('download', fileName)
    expect(mockAnchorElement.click).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('download should create a blob and call downloadBlob with correct parameters', async () => {
    const utils = useDownloadUtils() // Get the instance of your utils
    const fileName = 'test.json'
    const mimeType = 'application/json;charset=utf-8;'
    const dataStr = '{"test": "data"}'

    // Spy on downloadBlob method of the utils instance
    const downloadBlobSpy = vi.spyOn(utils, 'downloadBlob')

    await utils.download(fileName, mimeType, dataStr)

    expect(downloadBlobSpy).toHaveBeenCalledWith(fileName, expect.any(Blob))
  })
})
