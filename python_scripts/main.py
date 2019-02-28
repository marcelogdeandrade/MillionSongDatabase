import data_processing
from data_analysis import DataAnalysis

sc = data_processing.create_sc()
fulldata = data_processing.get_full_data(sc)
formatted_data = data_processing.format_data(fulldata)
filtered_data = data_processing.filter_weight(formatted_data)
artist_terms = data_processing.list_artist_terms(formatted_data)
sample_artist_terms = data_processing.sample_artist_terms(artist_terms)

analysis = DataAnalysis(filtered_data, sample_artist_terms)
analysis.add_genres()
analysis.add_avg_freq()
analysis.add_loudness()
analysis.add_num_songs()
analysis.add_average_hottness()
analysis.add_subgenre()

analysis.save_data()