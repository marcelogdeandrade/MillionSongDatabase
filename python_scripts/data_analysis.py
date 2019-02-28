from collections import Counter
import json

class DataAnalysis:
    def __init__(self, fulldata, sample_list):
        self.data = {}
        self.fulldata = fulldata
        self.sample_list = sample_list

    def add_genres(self):
        for i in self.sample_list:
            avg_duration_per_year = self.fulldata \
                                    .filter(lambda x: i in x['artist_terms']) \
                                    .filter(lambda x: x['year'] != 0) \
                                    .filter(lambda x: x['duration'] != 0) \
                                    .map(lambda x : (x['year'], (int(x['duration']), 1))) \
                                    .reduceByKey(lambda x,y : (x[0] + y[0], x[1] + y[1])) \
                                    .map(lambda x: (x[0], int(x[1][0] / (x[1][1]))))
            self.data[i] = {}
            for j in avg_duration_per_year.collect():
                self.data[i][j[0]] = {}
                self.data[i][j[0]]['avg_duration'] = j[1]
    
    def add_avg_freq(self):
        for i in self.sample_list:
            avg_tempo_per_year = self.fulldata \
                                    .filter(lambda x: i in x['artist_terms']) \
                                    .filter(lambda x: x['year'] != 0) \
                                    .filter(lambda x: x['tempo'] != 0) \
                                    .map(lambda x : (x['year'], (int(x['tempo']), 1))) \
                                    .reduceByKey(lambda x,y : (x[0] + y[0], x[1] + y[1])) \
                                    .map(lambda x: (x[0], int(x[1][0] / (x[1][1]))))
            for j in avg_tempo_per_year.collect():
                if (j[0] not in data[i]):
                    self.data[i][j[0]] = {}
                self.data[i][j[0]]['avg_tempo'] = j[1]
    
    def add_loudness(self):
        for i in self.sample_list:
            avg_loudness_per_year = self.fulldata \
                                    .filter(lambda x: i in x['artist_terms']) \
                                    .filter(lambda x: x['year'] != 0) \
                                    .filter(lambda x: x['loudeness'] != 0) \
                                    .map(lambda x : (x['year'], (int(x['loudeness']), 1))) \
                                    .reduceByKey(lambda x,y : (x[0] + y[0], x[1] + y[1])) \
                                    .map(lambda x: (x[0], round(x[1][0] / (x[1][1]), 2)))
            for j in avg_loudness_per_year.collect():
                if (j[0] not in data[i]):
                    self.data[i][j[0]] = {}
                self.data[i][j[0]]['avg_loudness'] = j[1]
    
    def add_num_songs(self):
        for i in self.sample_list:
            num_songs_per_year = self.fulldata \
                                    .filter(lambda x: i in x['artist_terms']) \
                                    .filter(lambda x: x['year'] != 0) \
                                    .map(lambda x : (x['year'], 1)) \
                                    .reduceByKey(lambda x,y : x + y)
            for j in num_songs_per_year.collect():
                if (j[0] not in self.data[i]):
                    self.data[i][j[0]] = {}
                self.data[i][j[0]]['num_songs'] = j[1]
    
    def add_average_hottness(self):
        for i in self.sample_list:
            avg_song_hotness_per_year = self.fulldata \
                                    .filter(lambda x: i in x['artist_terms']) \
                                    .filter(lambda x: x['year'] != 0) \
                                    .filter(lambda x: x['song_hotness'] != 'NaN') \
                                    .map(lambda x : (x['year'], (x['song_hotness'], 1))) \
                                    .reduceByKey(lambda x,y : (x[0] + y[0], x[1] + y[1])) \
                                    .map(lambda x: (x[0], round(x[1][0] / (x[1][1]), 2)))
            for j in avg_song_hotness_per_year.collect():
                if (j[0] not in self.data[i]):
                    self.data[i][j[0]] = {}
                self.data[i][j[0]]['avg_song_hotness'] = j[1]
    
    def add_subgenre(self):
        def count_subgenero(item):
            c = Counter(item[1])
            genero = item[0][1]
            del c[genero]
            total = len(c)
            #return(item[0], c)
            return(item[0], [(x,item[1].count(x)) for x in set(item[1])])
            
        for i in self.sample_list:
            years = self.fulldata \
                    .filter(lambda x: i in x['artist_terms']) \
                    .filter(lambda x: x['year'] != 0) \
                    .map(lambda x : ((x['year'],i), x['artist_terms'])) \
                    .reduceByKey(lambda x,y : x + y)\
                    .map(count_subgenero)

            for j in years.collect():
                if (j[0][0] not in self.data[i]):
                    self.data[i][j[0][0]] = {}
                self.data[i][j[0][0]]['subgenero'] = j[1]
    
    def save_data(self, filename = "data.txt"):
        with open(filename, 'w') as outfile:
            json.dump(self.data, outfile)