// import CreateFormView from '../view/create-form-view';
import FormEditView from '../view/form-edit-view.js';
import RoutePointView from '../view/route-point-view';
import SortListView from '../view/sort-list-view';
import ListView from '../view/list-view';
import EmptyPoinView from '../view/empty-point-view';
import { render, replace } from '../framework/render';
import { EditType, EmptyPhrase } from '../const.js';

export default class MainPresenter {
  #eventsList = new ListView();
  #boardContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #points = [];
  #offers = [];
  #destinations = [];
  constructor({ boardContainer, pointsModel, offersModel, destinationsModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    render(new SortListView(), this.#boardContainer);
    render(this.#eventsList, this.#boardContainer);
    if(this.#points.length === 0) {
      render(new EmptyPoinView({message: EmptyPhrase.NO_POINTS}), this.#eventsList.element);
    }
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i], this.#offers, this.#destinations);
    }
  }

  #renderPoint(point, offers, destinations, editType = EditType.EDIT) {

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditPointToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const onOpenEditButtonClick = () => {
      replacePointToEditPoint();
      document.addEventListener('keydown', escKeyDownHandler);
    };

    const onCloseEditButtonClick = () => {
      replaceEditPointToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    const onSubmitButtonClick = () => {
      replaceEditPointToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    const pointComponent = new RoutePointView({
      point,
      offers,
      destinations,
      editType,
      onOpenEditButtonClick
    });

    const pointEditComponent = new FormEditView({
      point,
      offers,
      destinations,
      onCloseEditButtonClick,
      onSubmitButtonClick
    });

    function replacePointToEditPoint() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceEditPointToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#eventsList.element);

  }
}
