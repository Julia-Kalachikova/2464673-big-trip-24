import { mockOffers } from '../mocks/offers';


export default class OffersModel {
  #offers = mockOffers;

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type) ?? [];
  }

}
