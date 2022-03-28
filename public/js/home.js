// noinspection JSUnresolvedFunction

/*
 * Copyright (c) 2022.
 *
 * File wrote it by Cristhian Torres
 * @cristhianDt
 */

let userId = '116'
let userImageElement = $('#user-image');
let userExpSummaryElement = $('#user-experience');
let userTimelineTitleElement = $('#user-timeline-title');
const getPortfolioEndpoint = '/api/v1/portfolios'

const defaultPortfolio = {
  names: 'John',
  lastNames: 'Snow',
  experience: null,
  experienceSummary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices, augue et vehicula pellentesque, ipsum velit viverra neque, a semper turpis eros a odio. Vestibulum luctus libero vehicula nisi porta rutrum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam bibendum mollis urna, vel gravida nisi faucibus eget. Mauris sed fermentum felis. Nullam ut erat a mi pulvinar consequat. Etiam eu molestie ex, sit amet vehicula dui. Nunc faucibus justo elit, id elementum urna rhoncus id. Aliquam ut molestie lacus, eu pellentesque nisl. Morbi suscipit egestas purus nec eleifend. Curabitur laoreet velit faucibus dictum tincidunt.\n'
}

const setInformation = (portfolio = defaultPortfolio) => {
  userTimelineTitleElement.text(`${portfolio.names}'s Timeline`)
  userExpSummaryElement.text(portfolio.experienceSummary)
}

const getPortfolio = () => {
  $.ajax({
    url: `${getPortfolioEndpoint}/user/${userId}`,
    type: "get",
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error getting audio: Status " + jqXHR + ":" + textStatus);
    },
    success: function (response, extStatus, jqXHR) {
      console.log(response)
      // container.src = `data:audio/webm;codecs=opus;base64,${response.data}`;
    }
  });
}

$(document).ready(function () {
  getPortfolio()
})

