using System;
using System.Collections.Generic;

namespace TestApp
{
    public class DataProcessor
    {
        private List<string> data;
        
        public DataProcessor()
        {
            data = new List<string>();
        }
        
        public void ProcessData(string input)
        {
            Console.WriteLine($"Processing: {input}");
            data.Add(input);
        }
        
        public int CalculateTotal(int a, int b)
        {
            return a + b;
        }
    }
    
    class Program
    {
        static void Main(string[] args)
        {
            DataProcessor processor = new DataProcessor();
            processor.ProcessData("Hello World");
            
            int result = processor.CalculateTotal(10, 20);
            Console.WriteLine($"Total: {result}");
        }
    }
}

// Made with Bob
