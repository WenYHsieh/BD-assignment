import pandas as pd
import json


df = pd.read_csv('./selectData.csv')
countryNames = df['縣市名稱'].unique()

result = {}

for name in countryNames:
    townNames = df[df['縣市名稱'] == name]['鄉鎮市區名稱']
    result[name] = list(townNames)


with open('./result.json', 'w') as file:
    json.dump(result, file, ensure_ascii=False)
