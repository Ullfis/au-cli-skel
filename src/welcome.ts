import { computedFrom, inject, NewInstance } from 'aurelia-framework';
import { ValidationController, ValidationRules } from 'aurelia-validation';
import { MaterializeFormValidationRenderer } from 'aurelia-materialize-bridge';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Element, EventAggregator, NewInstance.of(ValidationController))
export class Welcome {
  heading: string = 'Welcome to the Aurelia Navigation App';
  firstName: string = 'John';
  lastName: string = 'Doe';
  previousValue: string = this.fullName;

  controller = null;

  constructor(private element: Element, private ea: EventAggregator, controller: ValidationController) {
    this.controller = controller;
    this.controller.addRenderer(new MaterializeFormValidationRenderer());

    ValidationRules
    .ensure('firstName')
      .required()
    .ensure('lastName')
      .required()
      .minLength(4)
    .on(this);
  }

  //Getters can't be directly observed, so they must be dirty checked.
  //However, if you tell Aurelia the dependencies, it no longer needs to dirty check the property.
  //To optimize by declaring the properties that this getter is computed from, uncomment the line below
  //as well as the corresponding import above.
  @computedFrom('firstName', 'lastName')
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  greet() {
    this.previousValue = this.fullName;
    this.controller.validate();
  }

  canDeactivate(): boolean {
    if (this.fullName !== this.previousValue) {
      return confirm('Are you sure you want to leave?');
    }
  }
}

export class UpperValueConverter {
  toView(value: string): string {
    return value && value.toUpperCase();
  }
}
