import { createElement } from '../render';
import { EditType, EventType } from '../const';
import { capitalizedString } from '../utils';
import { BLANK_POINT } from '../const';

function createEditPointEventTypeTemplate(pointType) {
  return (
    Object.values(EventType).map((type) => (
      `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === pointType ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizedString(type)}</label>
      </div>`
    )).join('')
  );
}

function createEditPointOfferContainerTemplate(offersTemplate) {
  if (!offersTemplate) {
    return '';
  }
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>`
  );
}

function createEditPointOfferTemplate (offersPoint, offers) {
  if (!offersPoint.offers) {
    return '';
  }
  return offersPoint.offers.map(({title, price, id}) => {
    const offerClassName = title.split(' ').findLast((word) => word.length > 3).toLowerCase();
    return (
      `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerClassName}-1" type="checkbox" name="event-offer-${offerClassName}" ${offers.includes(id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offerClassName}-1">
        <span class="event__offer-title">${title}</span>
        +€&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
    );
  }).join('');
}

function createEditPointDestinationTemplate(destinationPoint, editType) {
  if (!destinationPoint) {
    return '';
  }
  return (
    editType === EditType.ADD
      ? destinationPoint.description
      : `${destinationPoint.description}
        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${destinationPoint.pictures.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}"></img>`).join('')}
          </div>
        </div>`
  );
}

function createEditPointDestinationContainerTemplate(destinationTemplate) {
  if (!destinationTemplate) {
    return '';
  }
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationTemplate}</p>
    </section>`
  );
}

function createEditPointButtonNegativeTemplate(editType) {
  return (
    editType === EditType.ADD
      ? '<button class="event__reset-btn" type="reset">Cancel</button>'
      : `<button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
  );
}

function createEditFormTemplate(point, offersApp, destinationsApp, editType) {
  const {basePrice, offers, destination, type} = point;
  const eventTypesTemplate = createEditPointEventTypeTemplate(type);
  const offersPoint = offersApp.find((offer) => offer.type === type);
  const offersTemplate = createEditPointOfferTemplate(offersPoint, offers);
  const offersContainerTemplate = createEditPointOfferContainerTemplate(offersTemplate);
  const destinationPoint = destinationsApp.find((item) => item.id === destination);
  const destinationTemplate = createEditPointDestinationTemplate(destinationPoint, editType);
  const destinationContainerTemplate = createEditPointDestinationContainerTemplate(destinationTemplate);
  const titleLabelTemplate = capitalizedString(type);
  const titleInputTemplate = destinationPoint ? destinationPoint.name : '';
  const buttonNegativeTemplate = createEditPointButtonNegativeTemplate(editType);
  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${titleLabelTemplate}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${titleInputTemplate}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
            —
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              €
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          ${buttonNegativeTemplate}
        </header>

        <section class="event__details">
          ${offersContainerTemplate}
          ${destinationContainerTemplate}
        </section>
      </form>
    </li>`
  );
}

export default class EditFormView {
  constructor({points = BLANK_POINT, offers, destinations, editType}) {
    this.points = points;
    this.offersApp = offers;
    this.destinationsApp = destinations;
    this.editType = editType;
  }

  getTemplate() {
    return createEditFormTemplate(this.points, this.offersApp, this.destinationsApp, this.editType);
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
