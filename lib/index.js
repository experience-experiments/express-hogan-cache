
import { getHoganFor } from 'hogan-cache'

import path from 'path'

function getConfigurationForPartialsFrom (viewModel) {
  const {
    settings,
    partials
  } = viewModel
  const config = {}
  const views = settings['views']
  const ext = settings['view engine']
  Reflect
    .ownKeys(partials)
    .forEach((key) => {
      const partialPath = partials[key]
      config[key] = path.join(views,
        (path.extname(partialPath))
          ? partialPath
          : `${partialPath}.${ext}`)
    })
  return config
}

const mapViewModelToHogan = (viewModel) => (
  Promise.resolve(getConfigurationForPartialsFrom(viewModel))
    .then(getHoganFor)
)

export const createEngine = () => (filePath, viewModel, f) => {
  getHoganFor({ filePath })
    .then(({ filePath }) => (
      ('partials' in viewModel)
        ? mapViewModelToHogan(viewModel).then((partials) => ({ filePath, partials }))
        : { filePath }
    ))
    .then(({ filePath, partials }) => filePath.render(viewModel, partials))
    .then((r) => f(null, r))
    .catch(f)
}
