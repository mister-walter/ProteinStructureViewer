from prody import *
from itertools import tee, izip
from collections import Iterable
import csv, sys

def pairwise(iterable):
    "s -> (s0,s1), (s1,s2), (s2, s3), ..."
    a, b = tee(iterable)
    next(b, None)
    return izip(a, b)

def get_secondary_indices(prot):
    if prot.getData('secondary') is None:
        raise ValueError('no secondary structure assignments')

    secondary_structures = ('extended', 'helix', 'helix310', 'helixpi',
    #          'turn', 'bridge', 'bend', 'coil')
              'turn', 'bridge', 'bend')

    structure_names = {'extended': 'beta_strand',
                       'helix': 'helix',
                       'helix310': 'helix',
                       'helixpi': 'helix',
                       'turn': 'turn',
                       'bridge': 'bridge',
                       'bend': 'bend',
                       'coil': 'coil'}

    # output = {}
    output = list()

    for structure in secondary_structures:
        if prot.select(structure) is None:
            continue # Don't bother with secondary structures we don't have.

        # Get the positions of all residues that are in the structure.
        residues = sorted(list(set(prot.select(structure).getResnums())))
        initials, terminals = [residues[0]], []

        # Whenever there is a gap between residues, note the positions as the
        # end of a secondary structure and the beginning of a new one.
        for this, next in pairwise(residues):
            if this + 1 != next:
                terminals.append(this)
                initials.append(next)

        # Add the terminal residue for the last secondary structure.
        terminals.append(residues[-1])

        #for start, end in zip(initials, terminals):

        #output[structure] = zip(initials, terminals)
        output.extend(map(lambda pair: {'category': 'secondary structure', 'type': structure_names[structure], 'text':'', 'start':pair[0], 'end':pair[1]}, zip(initials, terminals)))

    return output

# Converts a dictionary with singly-nested list values into a list where each
# item is a list of a key and each of the members of one of its subvalues.
# {key: [[val1, val2], [val3, val4]]} -> [[key, val1, val2], [key, val3, val4]]
def dict_to_flat_pair_list(dict):
    output = []
    for key in dict:
        for subval in dict[key]:
            out = [key]
            for i in subval:
                out.append(i)
            output.append(out)
    return output

# Turns a dict using lists to simulate multi-valued keys into a tab- and
# newline-separated table of keys and values.
def tab_sep_vals(dict):
    table = dict_to_flat_pair_list(dict)
    rows = ["\t".join(str(i) for i in row) for row in table]
    # adding spaces before the tab is a terrible solution to a word longer than a tab
    return "\n".join(rows)

def write_tsv(filename, feature_dict):
    with open(filename, 'wb') as tsvfile:
        tsvwriter = csv.DictWriter(tsvfile, fieldnames=['category', 'type', 'text', 'start', 'end'], delimiter='\t');
        tsvwriter.writeheader()
        tsvwriter.writerows(feature_dict)

def usage():
    print "usage: python features.py prot_identifier"

if len(sys.argv) == 2:
    prot = parsePDB(sys.argv[1], secondary=True)

    dict = get_secondary_indices(prot)
    write_tsv('../features/'+sys.argv[1]+'.tsv', dict)
else:
    usage()


'''
for key,val in get_secondary_indices(prot).iteritems():
    for i, j in val:
        print i, j, key
'''

#print tab_sep_vals(dict)

'''
'extended', 'helix', 'helix310', 'helixpi', 'turn', 'bridge', 'bend', 'coil'
'''
