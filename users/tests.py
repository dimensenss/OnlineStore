from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.messages import get_messages
from users.models import User

class RegisterUserTestCase(TestCase):

    def setUp(self):
        self.client = Client()

    def test_valid_registration_form_redirects_to_home_page(self):
        # Initialize
        form_data = {
            'username': 'testuser1',
            'email': 'testuser@1example.com',
            'first_name': 'Test2',
            'last_name': 'User2',
            'password1': 'testpassword2',
            'password2': 'testpassword2'
        }

        # Invoke
        response = self.client.post(reverse('users:register'), data=form_data)

        # Assert
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('goods:home'))
        messages = list(get_messages(response.wsgi_request))
        self.assertEqual(len(messages), 1)

