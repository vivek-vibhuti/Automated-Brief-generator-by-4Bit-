import traceback
import sys
from django.http import JsonResponse

class DebugExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        # Print full traceback to console
        print("\n" + "="*50)
        print("🔥 EXCEPTION CAUGHT IN MIDDLEWARE:")
        print("="*50)
        traceback.print_exc(file=sys.stdout)
        print("="*50 + "\n")
        
        # Return error details as JSON
        return JsonResponse({
            'error': str(exception),
            'type': exception.__class__.__name__,
            'traceback': traceback.format_exc().split('\n')
        }, status=500)