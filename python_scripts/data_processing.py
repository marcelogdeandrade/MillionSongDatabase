from pyspark import SparkContext
import urllib.request
import shutil
import h5py
import math
import reverse_geocoder as rg

def create_sc():
    sc = SparkContext()
    return sc

def get_full_data(sc):
    filename = "s3://millionsongsample2/results.txt"
    full_dataset = sc.textFile(filename).cache()
    return full_dataset


def format_data(full_dataset):
    def open_files(item):
        file_full_name = item
        file_small_name = item.split('/')[-1]
        url = "https://s3.amazonaws.com/millionsongsample2/{}".format(file_full_name)
        with urllib.request.urlopen(url) as response, open(file_small_name, 'wb') as out_file:
            shutil.copyfileobj(response, out_file)
        f = h5py.File(file_small_name, 'r')
        result = {}
        result['similar_artists'] = list(f['metadata']['similar_artists'])
        result['artist_terms'] = list(f['metadata']['artist_terms'])
        result['artist_terms_freq'] = list(f['metadata']['artist_terms_freq'])
        result['artist_terms_weight'] = list(f['metadata']['artist_terms_weight'])
        result['segments_start'] = list(f['analysis']['segments_start'])
        result['bars_start'] = list(f['analysis']['bars_start'])
        # result['mbtags'] = f['musicbrainz']['mbtags']
        for i in f['metadata/songs']:
            for j in i.dtype.names:
                result[j] = f['metadata']['songs'][j][0]
        for i in f['analysis/songs']:
            for j in i.dtype.names:
                result[j] = f['analysis']['songs'][j][0]
        for i in f['musicbrainz/songs']:
            for j in i.dtype.names:
                result[j] = f['musicbrainz']['songs'][j][0]
        if (not math.isnan(result['artist_latitude']) and not math.isnan(result['artist_longitude'])):
            coordinates = (result['artist_latitude'], result['artist_longitude'])
            info = rg.search(coordinates)
            result['country_code'] = info[0]['cc']
        else:
            result['country_code'] = None
        return result

    def get_useful_fields(item):
        result = {}
        result['artist_name'] = item['artist_name'].decode('UTF-8')
        result['artist_hotness'] = item['artist_hotttnesss']
        result['artist_terms'] = [x.decode('UTF-8') for x in item['artist_terms']]
        result['artist_terms_weight'] = item['artist_terms_weight']
        result['duration'] = item['duration']
        result['danceability'] = item['danceability']
        result['energy'] = item['energy']
        result['loudeness'] = item['loudness']
        result['song_hotness'] = item['song_hotttnesss']
        result['tempo'] = item['tempo']
        result['title'] = item['title'].decode('UTF-8')
        result['year'] = int(item['year'])
        result['country_code'] = item['country_code']
        return result

    files_formatted = full_dataset \
        .map(open_files) \
        .map(get_useful_fields)
    return files_formatted

def filter_weight(files_formatted, min_weight = 0.75):
    def get_only_big_artist_terms(item):
        for i in range(len(item['artist_terms'])):
            if (item['artist_terms_weight'][i] < min_weight):
                item['artist_terms'][i] = 0
        item['artist_terms'] = [x for x in item['artist_terms'] if x != 0]
        return item
        
    files_formatted_artist_terms = files_formatted \
                    .map(get_only_big_artist_terms)
    return files_formatted_artist_terms

def list_artist_terms(files_formatted):
    def get_artist_terms(item):
        return item['artist_terms']

    list_artist_terms = files_formatted \
                        .flatMap(lambda x: x['artist_terms']) \
                        .map(lambda x : (x, 1)) \
                        .reduceByKey(lambda x,y : x + y)
    return list_artist_terms

def sample_artist_terms(list_artist_terms):
    sample_list = list_artist_terms.takeOrdered(5, lambda x: -x[1])
    for i in range(len(sample_list)):
        sample_list[i] = sample_list[i][0]
    return sample_list
