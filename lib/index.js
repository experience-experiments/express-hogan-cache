var getHoganFor = require('hogan-cache').getHoganFor

module.exports = function (filePath, viewModel, f) { // define the template engine
  getHoganFor({ filePath })
    .then(({ filePath }) => filePath.render(viewModel))
    .then((r) => f(null, r))
    .catch(f);
}
