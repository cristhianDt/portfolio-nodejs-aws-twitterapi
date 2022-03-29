// noinspection JSUnresolvedFunction

/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */

let portfolio
const userId = '116'
const getPortfolioEndpoint = '/api/v1/portfolios'

const defaultPortfolio = {
  names: 'John',
  lastNames: 'Snow',
  experience: null,
  imagePath: null,
  experienceSummary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices, augue et vehicula pellentesque, ipsum velit viverra neque, a semper turpis eros a odio. Vestibulum luctus libero vehicula nisi porta rutrum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam bibendum mollis urna, vel gravida nisi faucibus eget. Mauris sed fermentum felis. Nullam ut erat a mi pulvinar consequat. Etiam eu molestie ex, sit amet vehicula dui. Nunc faucibus justo elit, id elementum urna rhoncus id. Aliquam ut molestie lacus, eu pellentesque nisl. Morbi suscipit egestas purus nec eleifend. Curabitur laoreet velit faucibus dictum tincidunt.\n'
}

const setInformation = (info) => {
  portfolio = info?.portfolio ?? defaultPortfolio
  console.log(portfolio)
  let userImageElement = $('#user-image')
  let userFullNameElement = $('#user-full-name')
  let userExpSummaryElement = $('#user-experience')
  let userTimelineTitleElement = $('#user-timeline-title')
  userFullNameElement.text(`${portfolio.names} ${portfolio.lastNames}`)
  userTimelineTitleElement.text(`${portfolio.names}'s Timeline`)
  userExpSummaryElement.text(portfolio.experienceSummary)
  /* edit form */
  $('input#names').val(portfolio.names)
  $('input#lastNames').val(portfolio.lastNames)
  $('textarea#experienceSummary').val(portfolio.experienceSummary)
}

const getPortfolio = () => {
  $.ajax({
    url: `${getPortfolioEndpoint}/user/${userId}`,
    type: 'get',
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('Error getting audio: Status ' + jqXHR + ':' + textStatus)
    },
    success: function (response, extStatus, jqXHR) {
      setInformation(response ?? undefined)
      // container.src = `data:audio/webm;codecs=opus;base64,${response.data}`;
    }
  })
}

const savePortfolio = () => {
  if (!portfolio?.id && !portfolio?._id) {
    alert('Error portfolio does not exist')
  }
  let formData = new FormData(),
      names = $('input#names').val(),
      lastNames = $('input#lastNames').val(),
      experienceSummary = $('textarea#experienceSummary').val(),
      file = $('#imagePath').prop("files")[0]
  formData.append('imagePath', file)
  formData.append('names', names)
  formData.append('lastNames', lastNames)
  formData.append('experienceSummary', experienceSummary)
  $.ajax({
    url: `${getPortfolioEndpoint}/${(portfolio?.id ?? portfolio?._id)}`,
    type: "POST",
    async: true,
    data: formData,
    cache: false,
    contentType: false,
    processData: false,
    timeout: 120000,
    success: function (responseObj) {
      console.log(responseObj)
    },
    error: function (jqXHR) {
      console.log(jqXHR)
    },
    complete: function (jqXHR, textStatus) {
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

const checkFileType = (file, types = ['image/png', 'image/jpeg']) => {
  return !types.includes(file.type)
}

$(document).ready(function () {
  setInformation()
  getPortfolio()
  $("#save-portfolio").click(function() {
    savePortfolio()
  })
  $('#imagePath').change(function (event) {
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
      $('#validationImagePathFeedback').html(error)
    } else {
      target.removeClass('is-invalid')
    }
  })
})

