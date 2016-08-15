var getHoganFor = require('hogan-cache').getHoganFor

var path = require('path')

function getPartials(viewModel) {
  const {
    settings,
    partials
  } = viewModel
  const config = {}
  const views = settings['views']
  const ext = settings['view engine']
  Object
    .keys(partials)
    .forEach((key) => {
      config[key] = path.join(views, `${partials[key]}.${ext}`)
    })
  return config
}

const getHoganPartials = (viewModel) => (
  Promise.resolve(getPartials(viewModel))
    .then(getHoganFor)
)

module.exports = function (filePath, viewModel, f) {
  getHoganFor({ filePath })
    .then(({ filePath }) => (
      ('partials' in viewModel)
        ? getHoganPartials(viewModel).then((partials) => ({ filePath, partials }))
        : { filePath }
    ))
    .then(({ filePath, partials }) => filePath.render(viewModel, partials))
    .then((r) => f(null, r))
    .catch(f);
}
