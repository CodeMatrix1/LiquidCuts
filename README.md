# LiquidCuts

LiquidCuts is a **data analysis pipeline** that scrapes, categorizes, and visualizes the **impact of news events on stock prices**. It consolidates information from news articles and financial data to highlight critical events affecting companies’ stock movements.

---

## 🚀 Features

- **Web scraping & categorization:** Automatically scrapes news articles and classifies events based on their impact.  
- **Stock impact analysis:** Fetches financial data and analyzes stock movements around article publication dates.  
- **Data visualization:** Renders **line charts** and **tree maps** of top company data using Chart.js and Google React Charts.  
- **Critical event extraction:** Identifies important events like layoffs, legal trials, and other high-impact incidents using **TF-IDF keyword extraction**.  
- **Iterative article filtering:** Continuously refines the dataset to highlight only significant news events.  

---

## 🏗️ Tech Stack

- **Frontend / Visualization:** React, Chart.js, Google React Charts  
- **Backend / Data Processing:** Python, Google Search API  
- **NLP / Analysis:** TF-IDF keyword extraction  
- **Other tools:** Node.js, npm  

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodeMatrix1/LiquidCuts.git
   cd LiquidCuts
2. Get a mongodb database url and run code in `Scraping101.ipynb`
3. Install the required dependencies `npm install`
4. Start the frontend application using `npm run dev`
