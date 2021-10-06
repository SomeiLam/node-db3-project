const db = require('../../data/db-config')

function find() {
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('sc.scheme_id', 'sc.scheme_name')
    .count('st.step_number as number_of_steps')
    .groupBy('sc.scheme_id')
}

async function findById(scheme_id) {
  const rows = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('sc.scheme_name', 'st.step_id', 'st.step_number', 'st.instructions', 'sc.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'asc')

  const result = {
    scheme_id: rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: rows.filter(scheme => {
      return scheme.step_id !== null
    })
      .map(step => {
        return {
          step_id: step.step_id,
          step_number: step.step_number,
          instructions: step.instructions
        }
      })
  }
  return result
}

async function findSteps(scheme_id) {
  return await db('steps as st')
    .leftJoin('schemes as sc', 'st.scheme_id', 'sc.scheme_id')
    .select(
      'st.step_id',
      'st.step_number',
      'st.instructions',
      'sc.scheme_name'
    )
    .where('st.scheme_id', scheme_id)
    .orderBy('st.step_number', 'asc')
}

function add(scheme) {
  return db('schemes')
    .insert(scheme)
    .then(ids => {
      return findById(ids[0])
    })
}

function addStep(scheme_id, step) {
  return db('steps').insert({
    ...step,
    scheme_id
  })
    .then(() => {
      return db('steps as st')
        .join('schemes as sc', 'sc.scheme_id', 'st.scheme_id')
        .select('step_id', 'step_number', 'instructions', 'scheme_name')
        .where('sc.scheme_id', scheme_id)
        .orderBy('step_number')
    })
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
