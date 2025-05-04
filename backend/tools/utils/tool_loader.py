
import importlib
import sys
import inspect
from pathlib import Path
from livekit.agents.llm.tool_context import is_function_tool, is_raw_function_tool


# Ensure the project root (one level up from utils/) is on sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


def load_tools_from_directory(directory: str = "functions") -> list:
    """Load all @function_tool decorated functions from a directory."""

    tools = []
    pkg_path = PROJECT_ROOT / directory
    # Confirm this directory is a package
    init_file = pkg_path / "__init__.py"
    if not init_file.exists():
        raise RuntimeError(f"Directory '{directory}' must be a Python package (missing __init__.py)")

    print(f"Loading tools from {pkg_path}")
    for file_path in pkg_path.glob("*.py"):
        # Skip private or init files
        if file_path.name.startswith("_") or file_path.name == "__init__.py":
            continue

        module_name = f"{directory}.{file_path.stem}"
        print(f"Importing module {module_name}")
        # Import the module dynamically
        try:
            module = importlib.import_module(module_name)
        except Exception as e:
            print(f"Failed to import {module_name}: {e}")
            continue

        # Inspect module members for function tools
        for _, obj in inspect.getmembers(module, inspect.isfunction):
            if is_function_tool(obj) or is_raw_function_tool(obj):
                print(f"Registering tool: {obj.__name__}")
                tools.append(obj)

    return tools


if __name__ == "__main__":
    # Quick test run
    loaded = load_tools_from_directory()
    print(f"Total tools loaded: {len(loaded)}")
