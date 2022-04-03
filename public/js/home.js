// noinspection JSUnresolvedFunction

/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */

let portfolio
const API_DOMAIN = '/api/v1'

const defaultPortfolio = localStorage.getItem('portfolio') && JSON.parse(localStorage.getItem('portfolio')) || {
  id: 1,
  names: 'John',
  lastNames: 'Snow',
  experience: null,
  imageUrl: 'assets/images/users/default-image.png',
  experienceSummary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices, augue et vehicula pellentesque, ipsum velit viverra neque, a semper turpis eros a odio. Vestibulum luctus libero vehicula nisi porta rutrum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam bibendum mollis urna, vel gravida nisi faucibus eget. Mauris sed fermentum felis. Nullam ut erat a mi pulvinar consequat. Etiam eu molestie ex, sit amet vehicula dui. Nunc faucibus justo elit, id elementum urna rhoncus id. Aliquam ut molestie lacus, eu pellentesque nisl. Morbi suscipit egestas purus nec eleifend. Curabitur laoreet velit faucibus dictum tincidunt.\n'
}

const setInformation = (info) => {
  portfolio = (info?.portfolio?._id || info?.portfolio?.portfolioId || info?.portfolio?.id) ? info.portfolio : { ...defaultPortfolio }
  let userImageElement = $('#user-image')
  let userFullNameElement = $('#user-full-name')
  let userExpSummaryElement = $('#user-experience')
  let userTimelineTitleElement = $('#user-timeline-title')
  userImageElement.attr('src', portfolio?.imageUrl)
  userFullNameElement.text(`${portfolio.names} ${portfolio.lastNames}`)
  userTimelineTitleElement.text(`${portfolio.names}'s Timeline`)
  userExpSummaryElement.html(portfolio?.experienceSummary.replaceAll('\r\n', '<br>') ?? '')
  /* edit form */
  $('input#names').val(portfolio.names)
  $('input#email').val(portfolio.email)
  $('input#lastNames').val(portfolio.lastNames)
  $('input#twitterUserName').val(portfolio.twitterUserName)
  $('textarea#experienceSummary').val(portfolio.experienceSummary)
  localStorage.setItem('portfolio', JSON.stringify(portfolio))
}

const getPortfolio = () => {
  $.ajax({
    url: `${API_DOMAIN}/portfolios/${(portfolio?._id ?? portfolio?.portfolioId ?? portfolio?.id)}`,
    type: 'get',
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('Error getting audio: Status ' + jqXHR + ':' + textStatus)
    },
    success: function (response, extStatus, jqXHR) {
      console.log(`Response: ${JSON.stringify(response)}`)
      setInformation(response ?? undefined)
      getTweets(response?.portfolio)
    }
  })
}

const savePortfolio = () => {
  if (!portfolio?.id && !portfolio?._id && !portfolio?.portfolioId) {
    alert('Error portfolio does not exist')
    return
  }
  let formData = new FormData(),
    names = $('input#names').val(),
    email = $('input#email').val(),
    lastNames = $('input#lastNames').val(),
    twitterUserName = $('input#twitterUserName').val(),
    experienceSummary = $('textarea#experienceSummary').val(),
    file = $('#imageUrl').prop('files')[0]
  if (file) {
    formData.append('imageUrl', file)
  }
  formData.append('email', email)
  formData.append('names', names)
  formData.append('lastNames', lastNames)
  if (twitterUserName && '' !== twitterUserName) {
    formData.append('twitterUserName', twitterUserName)
  }
  if (experienceSummary && '' !== experienceSummary) {
    formData.append('experienceSummary', experienceSummary)
  }
  $.ajax({
    url: `${API_DOMAIN}/portfolios/${(portfolio?._id ?? portfolio?.portfolioId ?? portfolio?.id)}`,
    type: 'POST',
    async: true,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    timeout: 120000,
    success: function (updatedPortfolio) {
      $('#editPortfolioModal').modal('hide')
      portfolio?.twitterUserName !== updatedPortfolio.portfolio?.twitterUserName && getTweets(updatedPortfolio.portfolio)
      setInformation({ portfolio: { ...portfolio, ...updatedPortfolio.portfolio } })
    },
    error: function (jqXHR) {
      if (typeof jqXHR != 'undefined' && jqXHR != null) {
        const res = jqXHR.hasOwnProperty('responseJSON') ? jqXHR.responseJSON : null
        alert(res?.message ?? 'Error')
      }
    },
    complete: function (jqXHR, textStatus) {
      $('#imageUrl').val('')
    }
  })
}

/**
 *
 * @param file
 * @param max 4MB
 * @returns {boolean}
 */
const checkFileSize = (file, max = 2097152/*1048576/*4194304*/) => {
  return !Number.isInteger(file.size) || max < file.size
}

const checkFileType = (file, types = [ 'image/png', 'image/jpeg' ]) => {
  return !types.includes(file.type)
}

const createTweets = (tweets, portfolio) => {
  let userTwTimelineElement = $('#user-tw-timeline-block')
  if (!tweets.length) userTwTimelineElement.html('')
  const twsHtml = tweets.map(({text, id, author_id, created_at}) => {
    return `<div class="row row-cols-2 justify-content-center">
      <div class="col-md-4">
          <svg viewBox="0 0 24 24" aria-hidden="true" class="" style="margin-top: 60%"><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>
      </div>
      <div class="col-md-8">
          <a href="https://twitter.com/${portfolio.twitterUserName}"><span style="font-size: 10px">@${portfolio.twitterUserName}</span></a>
          <h5 style="font-size: 14px">${portfolio.twitterUser}</h5>
          <a dir="ltr" href="https://twitter.com/twitter/status/${id}" rel="noopener noreferrer" target="_blank" role="link" style="font-size: 11px; color: dimgray" >
            <p aria-hidden="true">${text}</p>
          </a>
      </div>
      <hr>
  </div>`
  })
  userTwTimelineElement.html(twsHtml.join(''))
}

const getTweets = (portfolio) => {
  if (!portfolio || !portfolio.twitterUserId) return
  $.ajax({
    url: `${API_DOMAIN}/twitter/users/${portfolio.twitterUserId}/tweets`,
    type: 'get',
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('Error getting audio: Status ' + jqXHR + ':' + textStatus)
    },
    success: function (response, extStatus, jqXHR) {
      console.log(response)
      createTweets(response?.tweets ?? [], portfolio)
      // container.src = `data:audio/webm;codecs=opus;base64,${response.data}`;
    }
  })
}

$(document).ready(function () {
  setInformation()
  getPortfolio()
  $('#save-portfolio').click(function () {
    savePortfolio()
  })
  $('#imageUrl').change(function (event) {
    let target = $(event.target), error = null
    if (checkFileSize(event.target.files[0])) {
      error = 'The file can not be larger than 2 MB'
    }
    if (checkFileType(event.target.files[0])) {
      error = 'The file should be or .png or .jpeg'
    }
    if (error) {
      target.val('')
      target.addClass('is-invalid')
      console.log(`image path error: ${error}`)
      $('#validationImageUrlFeedback').html(error)
    } else {
      target.removeClass('is-invalid')
    }
  })
})

