# -*- coding: utf-8 -*-
from selenium import webdriver
driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(3)
driver.get(
    'https://www.melon.com/chart/index.htm')
tableBody = driver.find_element_by_xpath('//*[@id="frm"]/div/table/tbody')
tableRow = tableBody.find_elements_by_tag_name('tr')
for index, value in enumerate(tableRow):
    no = value.find_elements_by_tag_name('td')[0]
    rowNo = value.find_elements_by_tag_name('td')[1]
    address = value.find_elements_by_tag_name('td')[2]
    homeType = value.find_elements_by_tag_name('td')[3]
    print(no.text + rowNo.text + address.text + homeType.text)
