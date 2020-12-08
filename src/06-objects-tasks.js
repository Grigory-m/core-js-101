/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const args = Object.values(JSON.parse(json));
  let { Name } = proto.constructor;
  Name = proto.constructor;
  return new Name(...args);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {

  Selector: class {
    constructor(value, type, order) {
      this.selector = value;
      this.selectors = [];
      if (type) this.selectors.push([type, order]);
    }

    checkOrder(order) {
      if (this.selectors[this.selectors.length - 1][1] > order) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    }

    checkOccurTimes(selector) {
      if (this.selectors.flat().includes(selector)) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
    }

    element(value) {
      this.checkOccurTimes('element');
      this.checkOrder(1);
      this.selectors.push(['element', 1]);
      this.selector += `${value}`;
      return this;
    }

    id(value) {
      this.checkOccurTimes('id');
      this.checkOrder(2);
      this.selectors.push(['id', 2]);
      this.selector += `#${value}`;
      return this;
    }

    class(value) {
      this.checkOrder(3);
      this.selectors.push(['class', 3]);
      this.selector += `.${value}`;
      return this;
    }

    attr(value) {
      this.checkOrder(4);
      this.selectors.push(['attr', 4]);
      this.selector += `[${value}]`;
      return this;
    }

    pseudoClass(value) {
      this.checkOrder(5);
      this.selectors.push(['pseudoClass', 5]);
      this.selector += `:${value}`;
      return this;
    }

    pseudoElement(value) {
      this.checkOccurTimes('pseudoElement');
      this.checkOrder(6);
      this.selectors.push(['pseudoElement', 6]);
      this.selector += `::${value}`;
      return this;
    }

    stringify() {
      this.selectors = [];
      return this.selector;
    }
  },

  selectors: [],
  combinators: [],
  count: 0,

  element(value) {
    const selector = new this.Selector(`${value}`, 'element', 1);
    this.selectors.push(selector);
    return selector;
  },

  id(value) {
    const selector = new this.Selector(`#${value}`, 'id', 2);
    this.selectors.push(selector);
    return selector;
  },

  class(value) {
    const selector = new this.Selector(`.${value}`, 'class', 3);
    this.selectors.push(selector);
    return selector;
  },

  attr(value) {
    const selector = new this.Selector(`[${value}]`, 'attr', 4);
    this.selectors.push(selector);
    return selector;
  },

  pseudoClass(value) {
    const selector = new this.Selector(`:${value}`, 'pseudoClass', 5);
    this.selectors.push(selector);
    return selector;
  },

  pseudoElement(value) {
    const selector = new this.Selector(`::${value}`, 'pseudoElement', 6);
    this.selectors.push(selector);
    return selector;
  },

  combine(selector1, combinator) {
    this.count += 1;
    this.combinators.push(combinator);
    return this;
  },

  stringify() {
    const selectors = this.selectors.slice(`${-(this.count + 1)}`)
      .map((selector) => selector.selector);
    let i = 1;

    this.combinators.reverse().forEach((combinator, index) => {
      selectors.splice(index + i, 0, combinator);
      i += 1;
    });

    this.selectors = [];
    this.combinators = [];

    return selectors.join(' ');
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
