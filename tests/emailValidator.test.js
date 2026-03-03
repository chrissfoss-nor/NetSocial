const { isStudentEmail } = require('../src/emailValidator');

describe('isStudentEmail', () => {
  // Valid addresses
  test.each([
    'ola@stud.ntnu.no',
    'kari.nordmann@stud.uio.no',
    'student123@stud.oslomet.no',
    'test@stud.hvl.no',
    'a@stud.uib.no',
    'upper@STUD.NTNU.NO',           // case-insensitive
    'name@stud.bi-oslo.no',         // institution with hyphen
  ])('accepts valid student email: %s', (email) => {
    expect(isStudentEmail(email)).toBe(true);
  });

  // Invalid addresses
  test.each([
    'ola@ntnu.no',                  // missing stud subdomain
    'ola@stud.ntnu.com',            // not .no
    'ola@gmail.com',
    'ola@student.ntnu.no',          // "student" not "stud"
    '@stud.ntnu.no',                // no local part
    'ola@stud..no',                 // empty institution
    'ola@stud.no',                  // no institution
    '',
    'notanemail',
    'ola @stud.ntnu.no',            // space in local part
  ])('rejects invalid email: %s', (email) => {
    expect(isStudentEmail(email)).toBe(false);
  });
});
