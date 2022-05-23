# @stephanschuler/entity-store

Distribute rich domain models across stencil JS applications, based on
@stencil/store.

## Why?

The idea that led to creating this lib was storing rich objects with proper
domain logic as methods in the browsers local store or cookies. The
@stencil/store does a good job in storing plain objects and the event
mechanism (namely the "onChange" event) can be utilized to dump the current
state out to localstore. But while serialization of domain objects to
JSON.stringify() is fairly easy, rehydration from JSON is not.

## Example

I guess explaining how to use this lib is best done in a simple example.

```typescript
import { Entity, Repository } from "@stephanschuler/entity-store";

/*
 * Since the object state is stored in an inner payload property, the
 * default object state needs to be provided in another way.
 */
const defaultValue = {
    name: 'foo',
    price: 10
};

/*
 * The Schema type goes into the generic tempalte of the base Entity
 * class. It might be derived from the defaultValue.
 */
type ProductSchema = typeof defaultValue;

export class Product extends Entity<ProductSchema> {
    constructor(source: ProductSchema = null) {
        super(source ?? defaultValue);
    }

    get name(): string {
        /*
         * TypeScript knows there's a name property, and it knows
         * it's of type string based on the provided schema.
         */
        return this.getEntityValue('name');
    }

    set name(name: string) {
        this.setEntityValue('name', name);
    }

    get price(): number {
        return this.getEntityValue('price') / 100;
    }

    set price(price: number) {
        this.setEntityValue('price', price) * 100;
    }
}

/*
 * The Repository is not a class but an instance. It's the place to
 * look for existing entities.
 */
export const ProductRepository = Repository(Product);

/*
 * When dumping entities to e.g. localstore, there needs to be a
 * mapping between the entity class and a stringy type identifier
 * that can be part of the JSON.stringified value.
 */
Entity.registerEntityType(
    Product,
    'product'
);
```

```tsx
import { Component, h, State } from '@stencil/core';
import { Produkt, ProduktRepository } from "./produkt";
import { Subscription } from "rxjs";

@Component({
    tag: 'app-component',
})
export class AppComponent {

    connectedCallback() {
        /*
         * Whenever there are new entities of existing ones are deleted,
         * the products$ streme issues the new state.
         */
        this.products$ = ProduktRepository
            .updates$
            .subscribe(products => {
                this.products = products;
            });
    }

    disconnectedCallback() {
        /*
         * Disconnecting is not done automatically
         */
        this.updates$.unsubscribe();
    }

    /*
     * The array does not need to be @State because replacing it through
     * the subscription triggers rerendering automatically, just as
     * changing a property of a single product does.
     */
    products: Product[] = [];
    products$: Subscription;

    render() {
        return (
            <ul>
                {this.products.map(product => this.renderProduct(product))}
            </ul>
        );
    }

    renderProduct(product: Produkt) {
        return (
            <li>
                {product.name} ({product.price})
            </li>
        );
    }
}

```