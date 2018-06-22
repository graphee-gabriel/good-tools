
export const capitalizeFirstLetter = (string) => {
  // return string.charAt(0).toUpperCase() + (string.length > 1 && string.slice(1).toLowerCase());
  return string.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export const removeComma = (string) => {
  // return string.charAt(0).toUpperCase() + (string.length > 1 && string.slice(1).toLowerCase());
  return string.replace(/,/g , '')
}

export const clean = (string) => {
  return capitalizeFirstLetter(removeComma(string))
}

export const copyToClipboard = (text) => {
  console.log('text to copy,', text)
  var dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.setAttribute('value', text);
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

export const extractEmailParts = email => {
  if (!email) return []
  const emailParts = []
  const emailCleanParts = email.replace(/[0-9]/g, '').split('@')
  const emailClean = emailCleanParts.length > 0 && emailCleanParts[0]
  if (emailClean) {
    const emailDot = emailClean.split('.')
    if (emailDot.length > 1) {
      emailDot.forEach(e => {
        if (e.length > 2)
          emailParts.push(capitalizeFirstLetter(e))
      })
    } else {
      const emailUnderscore = emailClean.split('_')
      if (emailUnderscore.length > 1) {
        emailUnderscore.forEach(e => {
          if (e.length > 2)
            emailParts.push(capitalizeFirstLetter(e))
        })
      } else {
        const emailDash = emailClean.split('-')
        if (emailDash.length > 1) {
          emailDash.forEach(e => {
            if (e.length > 2)
              emailParts.push(capitalizeFirstLetter(e))
          })
        } else {
          emailParts.push(capitalizeFirstLetter(emailClean))
        }
      }
    }
  }
  return emailParts.filter(x => x !== '' && x !== ' ')
}


export const buildNamesFromEmails = emails => {
  let firstNameOptionsArray = []
  emails.forEach(email => {
    const parts = extractEmailParts(email)
    parts.forEach(part => {
      if (firstNameOptionsArray.indexOf(part) === -1)
        firstNameOptionsArray.push(part)
    })
  })
  firstNameOptionsArray.sort()
  return firstNameOptionsArray
}