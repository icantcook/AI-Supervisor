import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime
import time
from data_context import DataContext

class TestDataContext:
    @pytest.fixture
    def data_context(self):
        ctx = DataContext()
        # Patch actual Firebase operations
        ctx.firebase.push_value = MagicMock(return_value="test_req_123")
        ctx.firebase.get_value = MagicMock()
        yield ctx
        ctx.close()

    def test_create_help_request(self, data_context):
        # Test data
        test_question = "What's the return policy?"
        test_contact = "user@example.com"
        
        # Execute
        request_id = data_context.create_help_request(test_question, test_contact)
        
        # Verify Firebase call
        data_context.firebase.push_value.assert_called_once_with(
            "helpRequests/requests",
            {
                "customerContact": pytest.any(str),
                "question": test_question,
                "status": "pending",
                "createdAt": pytest.any(int),
                "timeoutAt": pytest.any(int),
                "answer": None,
                "supervisorId": None
            },
            {"helpRequests/status/pending/{request_id}": True}
        )
        
        # Validate ID format
        assert isinstance(request_id, str)
        assert request_id.startswith("test_req_")

    def test_get_knowledge_base_context(self, data_context):
        # Mock Firebase response
        mock_knowledge = {
            "return_policy": {
                "answer": "30-day returns"
            },
            "shipping": {
                "answer": "Free shipping over $50"
            }
        }
        data_context.firebase.get_value.side_effect = lambda path: (
            mock_knowledge.get(path.split('/')[-1], None))
       
        # Verify structure
        assert "return_policy - 30-day returns" in result
        assert "synonyms - ['returns', 'refund policy']" in result
        assert "shipping - Free shipping over $50" in result
        assert "missing_entry" not in result
        assert result.endswith(".")

    def test_empty_knowledge_base(self, data_context):
        data_context.firebase.get_value.return_value = None
        assert data_context.get_knowledge_base_context(["invalid/path"]) == ""

    def test_concurrent_access(self, data_context):
        # Verify thread safety
        def concurrent_ops():
            for _ in range(100):
                data_context.create_help_request("test", "contact")
                data_context.get_knowledge_base_context([])

        # Use ThreadPoolExecutor to simulate concurrency
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(concurrent_ops) for _ in range(10)]
            for future in asyncio.as_completed(futures):
                future.result()  # Shouldn't raise threading errors

        # Verify all calls were properly locked
        assert data_context.firebase.push_value.call_count == 1000