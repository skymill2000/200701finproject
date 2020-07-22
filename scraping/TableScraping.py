# -*- coding: utf-8 -*-
from selenium import webdriver
driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(3)
driver.get(
    'https://www.alimi.or.kr/api/a/vacant/selectApiVacant.do')
table = driver.find_element_by_class_name('search_list')
tableBody = table.find_element_by_tag_name('tbody')
rows = tableBody.find_elements_by_tag_name('tr')
for index, value in enumerate(rows):
    if index != 0:
        rowNo = value.find_elements_by_tag_name('td')[1]
        print(rowNo.text)
