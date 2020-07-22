# -*- coding: utf-8 -*-
from selenium import webdriver
driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(3)
driver.get(
    'https://newstapa.org/article/ncdGM')
title = driver.find_element_by_xpath('/html/body/section[1]/div/div[1]/h3')
body = driver.find_element_by_xpath('//*[@id="journal_article_wrap"]')

print(title.text)
print(body.text)
