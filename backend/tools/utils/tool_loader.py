
import importlib
import inspect
from pathlib import Path
from livekit.agents.llm.tool_context import is_function_tool, is_raw_function_tool


def load_tools_from_directory(directory: str = "functions") -> list:
    """Load all @function_tool decorated functions from a directory"""
    tools = []
    tools_dir = Path(directory)
    
    # Iterate through all Python files in the directory
    for file_path in tools_dir.glob("*.py"):
        if file_path.name.startswith("_") or file_path.name == "__init__.py":
            continue

        # Convert to module path (e.g., "tools.weather")
        module_name = f"{directory}.{file_path.stem}"
        try:
            module = importlib.import_module(module_name)
        except Exception as e:
            print(f"Error importing {module_name}: {e}")
            continue

        # Find all decorated functions
        for _, obj in inspect.getmembers(module):
            if inspect.isfunction(obj) and (
                is_function_tool(obj) or 
                is_raw_function_tool(obj)
            ):
                tools.append(obj)
                print(f"Loaded tool: {obj.__name__}")  # Debug

    return tools
