import librosa
import numpy as np
import pandas as pd
import os

# 512 samples per frame at 44.1kHz is around 86 fps
def build_features(y, sr, n_fft=4096, hop_length=512):
    params = {
        'n_fft': n_fft,
        'hop_length': hop_length
    }
    S, phase = librosa.magphase(librosa.stft(y, **params))
    features = {
        'centroid': librosa.feature.spectral_centroid,
#         'bandwidth': librosa.feature.spectral_bandwidth,
#         'contrast': librosa.feature.spectral_contrast,
#         'rolloff': librosa.feature.spectral_rolloff
    }
    features = {k: v(S=S, sr=sr, **params) for k,v in features.items()}
    features['flatness'] = librosa.feature.spectral_flatness(S=S, **params)
    features['rms'] = librosa.feature.rms(S=S, frame_length=params['n_fft'])
    return features

def build_fingerprint(y, sr, fmin=100, fmax=10000, n_bins=64, normalize=True, hop_length=512):
    octaves = librosa.hz_to_octs(fmax) - librosa.hz_to_octs(fmin)
    bins_per_octave = int(np.floor(n_bins / octaves))
    S = librosa.cqt(y, sr=sr, hop_length=hop_length, fmin=fmin, n_bins=n_bins, bins_per_octave=bins_per_octave)
    amp = librosa.amplitude_to_db(np.abs(S))
    amp = np.flipud(amp)
    if normalize:
        amp -= amp.min()
        amp /= amp.max()
    return amp.T

theme_to_units = {
    1: 'NO',
    2: 'PQRST',
    3: 'FGH',
    4: 'IJK',
    5: 'LM'
}

unit_to_theme = {}
for k,v in theme_to_units.items():
    for unit in v:
        unit_to_theme[unit] = k
        
def build_targets(annotation_fn, y, sr, amp, gloss=True):
    n = len(amp)
    units = np.empty(shape=n, dtype='<U8')
    unit_position = np.zeros((n), np.float32)
    labels = []
    
    if not os.path.exists(annotation_fn):
        print('No annotations available:', annotation_fn)
        singing = np.zeros((n), np.int8)
        themes = -np.ones((n), np.int8)
        return targets, labels, singing, themes, unit_position
    
    annotations = pd.read_csv(annotation_fn, sep='\t')

    # fill out target same size as frames
    seconds_to_frame = n / (len(y) / sr)
    for row in annotations.values:
        begin_sec, end_sec = row[3], row[4]
        begin_frame = int(seconds_to_frame * begin_sec)
        end_frame = int(seconds_to_frame * end_sec)
        unit = row[-1]
        if gloss:
            unit = unit[0]
        units[begin_frame:end_frame] = unit
        unit_position[begin_frame:end_frame] = np.linspace(0, 1, end_frame - begin_frame)
    
    themes = []
    for unit in units:
        if unit == '':
            themes.append(-1)
            continue
        themes.append(unit_to_theme[unit])
    themes = np.asarray(themes, dtype=np.int8)
        
    singing = (units != '').astype(np.int8)

    return units, singing, themes, unit_position

def to_indices(labels):
    unique_labels = sorted(list(set(labels)))
    label_to_index = {label:i for i,label in enumerate(unique_labels)}
    index_to_label = {i:label for i,label in enumerate(unique_labels)}
    indices = [label_to_index[label] for label in labels]
    return indices, label_to_index, index_to_label