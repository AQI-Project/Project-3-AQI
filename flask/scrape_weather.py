from splinter import Browser
from bs4 import BeautifulSoup as bs
import pandas as pd
import time
import numpy as np


def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "/usr/local/bin/chromedriver"}
    return Browser("chrome", **executable_path, headless=False)


def scrape_url (url):
    browser =  init_browser()
    browser.visit(url)
    time.sleep(3)  #must 3 seconds
    html = browser.html
    soup =  bs(html,"html.parser")
    browser.quit()
    return soup


def scrape():
    # create data dict that we can insert into mongo
    weather_data = {}

    # # table 
    url_tables = 'https://www.iqair.com/world-air-quality'
    test_soup = scrape_url(url_tables)

    country_url = []
    tests = test_soup.find_all('div',class_ = 'name')
    for test in tests:
        wocao = test.find('a')['href']
        country_url.append(f'https://www.iqair.com{wocao}')
    
    # country_url= ['https://www.iqair.com/south-africa/gauteng/johannesburg',
    # 'https://www.iqair.com/china/guangdong/shenzhen',
    # 'https://www.iqair.com/south-korea/seoul',
    # 'https://www.iqair.com/iran/tehran',
    # 'https://www.iqair.com/china/zhejiang/hangzhou',
    # 'https://www.iqair.com/indonesia/jakarta',
    # 'https://www.iqair.com/pakistan/sindh/karachi',
    # 'https://www.iqair.com/south-korea/gyeonggi-do/incheon',
    # 'https://www.iqair.com/kuwait/al-asimah/kuwait-city',
    # 'https://www.iqair.com/india/delhi']
    
    tables_cao = []
    tables_name = []
   
    for x in country_url:
        table_soup = scrape_url(x)  # !!!!'list' object is not callable
        table_country = table_soup.find('table',class_ = 'aqi-overview-detail__main-pollution-table').find_all('td')
        title = table_soup.find('h1').text
        tables_cao.append(table_country)
        tables_name.append([title])
    
    td_value = []
    for s in tables_cao:
        z=[]
        td_value.append(z)
        for w in s:
            x = w.text
            z.append(x)

    first = np.array(td_value)
    second = np.array(tables_name)
    url_l=[]
    for x in country_url:
        url_l.append([x])
    third = np.array(url_l)
    final_td = np.concatenate((second,third,first), axis=1).tolist()

    weather_data['td'] = final_td
    #[['Air quality in Johannesburg',
#   'https://www.iqair.com/south-africa/gauteng/johannesburg',
#   'Moderate',
#   '63 US AQI',
#   'PM2.5']]

    # Summary from WHO
    who_url='https://www.who.int/news-room/q-a-detail/q-a-on-climate-change-and-covid-19#'
    summary_soup = scrape_url(who_url)  # question2
    answer1 = summary_soup.find_all('div',class_ = 'sf-accordion__content')[1].find_all('p')[1].text
    answer2 = summary_soup.find_all('div',class_ = 'sf-accordion__content')[3].find_all('p')[2].text
    weather_data['q1'] = answer1
    weather_data['q2'] = answer2

    # ufo_url='http://127.0.0.1:5500/flask/templates/ufo.html'  #golive url
    # ufo_soup = scrape_url(ufo_url)
    # ufo_table = str(ufo_soup.find('tbody'))
    # weather_data['ufo'] = ufo_table


    # #how we get the data
    # countries_df = pd.read_html('https://developers.google.com/public-data/docs/canonical/countries_csv')
    # clean_countries = countries_df[0].rename(columns={"name":"Country","country":"Abbr"})
    # lat = clean_countries['latitude']
    # lon = clean_countries['longitude']
    # md = zip(lat,lon)
    # ri = list(md)
    # saving_to_list = []
    # for x in ri:
    #     lat_lng = f'https://api.airvisual.com/v2/nearest_city?lat={round(list(x)[0],2)}&lon={round(list(x)[1],2)}&key={API_KEY}' 
    #     time.sleep(12)# reach 'https://www.iqair.com/air-pollution-data-api/plans'
    #     lat_lng_response = requests.get(lat_lng).json()
    #     try:
    #         saving_to_list.append(lat_lng_response)
    #         pprint(lat_lng_response)
    #     except:
    #         print("Something went wrong")
    #     pass
    # import json
    # with open('data.json', 'w') as f:
    #     json.dump(final_list, f)


    weather_data['nm'] = 'test'

    return weather_data






    # # Featured Image
    # url_img='https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    # img_soup = scrape_url(url_img)
    # img_url = img_soup.find('div',class_='img').find('img')['src']
    # featured_image_url = f'https://www.jpl.nasa.gov{img_url}'

    # weather_data['featured_image_url'] = featured_image_url


    # # Mars Weather
    # url_weather='https://twitter.com/marswxreport?lang=en'
    # weather_soup = scrape_url(url_weather)
    # mars_weather = weather_soup.find('div',lang='en').find('span').text

    # weather_data['mars_weather'] = mars_weather


    # # Mars Facts
    # url_table='https://space-facts.com/mars/'
    # table_soup = scrape_url(url_table)
    # mars_table = str(table_soup.find('tbody'))
    
    # weather_data['mars_facts'] = mars_table

    # # tables = pd.read_html(url_table)
    # # df = tables[0]
    # # df.columns=['parameter','value']
    # # html_table = df.to_html()
    # # facts_table = html_table.replace('\n', ' ')
    # #df.to_html('table.html')
    # #mars_data['table'] = facts_table
    

    # # Mars Hemispheres
    # url_mars='https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    # mars_soup = scrape_url(url_mars)
    # items = mars_soup.find_all('div', class_='description')

    # hemisphere_image_urls=[]
    # for item in items:
    #     title=item.h3.text
    #     url=item.find('a')['href']
    #     z={'title':title,'img_url':f'https://astrogeology.usgs.gov{url}'}
    #     hemisphere_image_urls.append(z)
    
    # md=[]
    # for i_url in hemisphere_image_urls:
    #     image_soup = scrape_url(i_url['img_url'])
    #     x= image_soup.find('ul').find('a')['href']
    #     y={'title':i_url['title'],'img_url':x}
    #     md.append(y)


    # weather_data['title_url'] = md
    

    

# scrape()










    




















##

#     url_news='https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest'
#     ##browser.visit(url_news)
#     ##time.sleep(1)
#     ##html = browser.html
#     ##soup = bs(html, "html.parser")

#     # Scrape page into Soup
#     html = browser.html
#     soup = bs(html, "html.parser")

#     # Get the average temps
#     avg_temps = soup.find('div', id='weather')

#     # Get the min avg temp
#     min_temp = avg_temps.find_all('strong')[0].text

#     # Get the max avg temp
#     max_temp = avg_temps.find_all('strong')[1].text

#     # BONUS: Find the src for the sloth image
#     relative_image_path = soup.find_all('img')[2]["src"]
#     sloth_img = url + relative_image_path

#     # Store data in a dictionary
#     costa_data = {
#         "sloth_img": sloth_img,
#         "min_temp": min_temp,
#         "max_temp": max_temp
#     }

#     # Close the browser after scraping
#     browser.quit()

#     # Return results
#     return costa_data
# ##