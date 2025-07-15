from django.test import TestCase


from django.test import TestCase
from rest_framework.test import APIClient

class ApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_status_endpoint(self):
        response = self.client.get('/api/status/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('status', response.data)

    def test_move_endpoint(self):
        response = self.client.post('/api/move/', {
            'positions': [0, 0, 0, 0, 0, 0],
            'duration': 5,
            'speed': 1.0
        }, format='json')
        self.assertEqual(response.status_code, 200)

    def test_stop_endpoint(self):
        response = self.client.post('/api/stop/')
        self.assertEqual(response.status_code, 200)
