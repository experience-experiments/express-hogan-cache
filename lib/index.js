
/*
 *  TODO: naming is terrible but this is a POC anyway
 */

import { getHoganFor } from '../../hogan-cache'

import path from 'path'

function getPartialsFor (viewModel) {
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
      config[key] = path.join(views, `${partials[key]}.${ext}`)
    })
  return config
}

const getHoganPartialsFor = (viewModel) => (
  Promise.resolve(getPartialsFor(viewModel))
    .then(getHoganFor)
)

export const createEngine = () => (filePath, viewModel, f) => {
  getHoganFor({ filePath })
    .then(({ filePath }) => (
      ('partials' in viewModel)
        ? getHoganPartialsFor(viewModel).then((partials) => ({ filePath, partials }))
        : { filePath }
    ))
    .then(({ filePath, partials }) => filePath.render(viewModel, partials))
    .then((r) => f(null, r))
    .catch(f)
}
