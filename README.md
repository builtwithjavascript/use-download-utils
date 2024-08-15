# use-download-utils
Helper to more easily download data in JavaScript/TypeScript in a front-end application

## Install
`npm i -D @built`

## Consume
```
import { useDownloadUtils } from '@builtwithjavascript/use-download-utils'

...

const downloadUtils = useDownloadUtils()

const serializedData = JSON.serialize(yourobject)

await downloadUtils.download(fileName, downloadUtils.mimeTypes.json, serializedData)

```
