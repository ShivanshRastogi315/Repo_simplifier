import os
from utils import helper_function

class DataProcessor:
    def __init__(self):
        self.data = []
    
    def process_data(self, input_data):
        """Process the input data"""
        result = helper_function(input_data)
        return result
    
    def save_data(self, filename):
        """Save data to file"""
        with open(filename, 'w') as f:
            f.write(str(self.data))

def main():
    processor = DataProcessor()
    processor.process_data("test")
    processor.save_data("output.txt")

if __name__ == "__main__":
    main()

# Made with Bob
