const db = require('../../data/db-config')

const checkSchemeId = async (req, res, next) => {
  try {
    const exists = await db('schemes')
      .where('scheme_id', req.params.scheme_id)
      .first()
    if (!exists) {
      req.error = { message: `scheme with scheme_id ${req.params.scheme_id} not found` }
      next()
    } else {
      next()
    }
  } catch (error) {
    next(error)
  }
}

const validateScheme = (req, res, next) => {
  if (req.body.scheme_name === undefined ||
    typeof req.body.scheme_name !== 'string' ||
    !req.body.scheme_name.trim()
  ) {
    next({
      status: 400,
      message: 'invalid scheme_name'
    })
  } else {
    next()
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {

}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
