/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
// const stripe = Stripe('pk_test_51JfhXRBgHPNsY4O0cSgEFUAu2cOeqLiVEBobpl7lljagW58VjPEreryimyIJK5ulW7s1w5ZaWZcpDsC79dcvj3Kz006PT49czL');

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
};
