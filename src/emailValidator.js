/**
 * Validates that an email address belongs to a Norwegian student domain.
 * Accepted format: <username>@stud.<institution>.no
 * Example: ola.nordmann@stud.ntnu.no
 *
 * @param {string} email
 * @returns {boolean}
 */
function isStudentEmail(email) {
  return /^[^\s@]+@stud\.[a-z0-9-]+\.no$/i.test(email);
}

module.exports = { isStudentEmail };
