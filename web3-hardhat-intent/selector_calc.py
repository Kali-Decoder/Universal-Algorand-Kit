import json
import hashlib

def calculate_selector(method):
    name = method['name']
    args = ",".join([arg['type'] for arg in method['args']])
    returns = method['returns']['type']
    signature = f"{name}({args}){returns}"
    # Use sha512 and truncate to 256 bits (32 bytes) then take first 4 bytes
    # This is what SHA-512/256 is. If hashlib doesn't have it, we can't easily replicate the 
    # exact IV without a library, but let's try the common 'sha512_256' name first if available 
    # or use a different approach. Actually, ARC-56/ARC-4 use SHA-512/256. 
    # Let's check available hashes.
    try:
        h = hashlib.new('sha512_256')
    except ValueError:
        # Fallback to a manual check of available algorithms or use a known implementation if necessary
        # However, usually sha512_256 is what's needed.
        raise Exception("sha512_256 not available in hashlib")
    
    h.update(signature.encode())
    selector = h.digest()[:4].hex()
    return signature, selector

def process_file(path):
    print(f"\nFile: {path}")
    with open(path, 'r') as f:
        data = json.load(f)
        for method in data['methods']:
            sig, sel = calculate_selector(method)
            print(f"Signature: {sig} | Selector: 0x{sel}")

files = [
    "/Users/maroti/Algorand Dev/Universal Algorand Kit/web3-hardhat-intent/algorand/smart_contracts/artifacts/todo/TodoList.arc56.json",
    "./algorand/smart_contracts/artifacts/executor/ArcExecutor.arc56.json"
]

for file in files:
    try:
        process_file(file)
    except Exception as e:
        print(f"Error processing {file}: {e}")

print("\nAvailable hashes:", hashlib.algorithms_available)
