// Where questionnaire answers are emailed (via FormSubmit). Nothing is stored on this website.
// After FormSubmit activation, replace `to` with the random alias string from the activation email
// (e.g. to: "a1b2c3d4e5f6...") so the address no longer appears in the page.
window.TRC_QUESTIONNAIRE = {
  to: ["president", "torontorevolverclub.com"],
  cc: [["membershipsecretary", "torontorevolverclub.com"]]
};
