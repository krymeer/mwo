import Vue from 'vue'

/**
 * Pusta instancja, nie przyczepiona do DOM.
 * Służy jako pośrednik dla customowych eventów, np.:
 * 
 * sender:
 *  wysłanie eventu: EventBus.$emit(eventName, ...params)
 * 
 * receiver:
 *  created: function() {
 *    EventBus.$on(eventName, callback)
 *  }
 */
const EventBus = new Vue()

export default EventBus