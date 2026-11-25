// Where questionnaire answers are emailed (via FormSubmit). Nothing is stored on this website.
// enabled:false = form can be read, but Send is disabled and nothing is sent (no emails to anyone).
// To switch on: set enabled:true, send a test so the president@ inbox gets FormSubmit's activation
// email, click it, then replace `to` with the random alias string from that email.
window.TRC_QUESTIONNAIRE = {
  enabled: false,
  to: ["president", "torontorevolverclub.com"],
  cc: [["membershipsecretary", "torontorevolverclub.com"]]
};
