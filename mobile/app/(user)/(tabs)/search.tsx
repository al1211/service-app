import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  TextInput,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '../../../src/theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  deliveryTime: string;
  tag?: string;
  tagColor?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  isPopular?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}

interface RecentSearch {
  id: string;
  query: string;
  type: 'service' | 'provider';
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const allResults: SearchResult[] = [
  {
    id: '1',
    name: 'Home Deep Cleaning',
    category: 'Cleaning',
    rating: 4.9,
    reviews: 2340,
    price: '₹499',
    deliveryTime: 'Today',
    tag: 'Best Seller',
    tagColor: colors.primary,
    icon: 'sparkles-outline',
    iconColor: colors.primary,
    iconBg: colors.primary + '15',
    isPopular: true,
  },
  {
    id: '2',
    name: 'Bathroom Cleaning',
    category: 'Cleaning',
    rating: 4.7,
    reviews: 1820,
    price: '₹299',
    deliveryTime: 'Today',
    icon: 'water-outline',
    iconColor: colors.primaryLight,
    iconBg: colors.primaryLight + '15',
  },
  {
    id: '3',
    name: 'Kitchen Chimney Cleaning',
    category: 'Cleaning',
    rating: 4.8,
    reviews: 980,
    price: '₹399',
    deliveryTime: 'Tomorrow',
    icon: 'flame-outline',
    iconColor: colors.warning,
    iconBg: colors.warning + '15',
  },
  {
    id: '4',
    name: 'Pipe Leak Repair',
    category: 'Plumbing',
    rating: 4.6,
    reviews: 760,
    price: '₹249',
    deliveryTime: 'Today',
    tag: 'Fast',
    tagColor: colors.success,
    icon: 'build-outline',
    iconColor: colors.driverAccent,
    iconBg: colors.driverAccent + '12',
  },
  {
    id: '5',
    name: 'Switchboard Repair',
    category: 'Electrician',
    rating: 4.8,
    reviews: 1450,
    price: '₹199',
    deliveryTime: 'Today',
    icon: 'flash-outline',
    iconColor: colors.warning,
    iconBg: colors.warning + '12',
    isPopular: true,
  },
  {
    id: '6',
    name: 'AC Gas Refill',
    category: 'AC Repair',
    rating: 4.5,
    reviews: 540,
    price: '₹899',
    deliveryTime: '2 days',
    icon: 'snow-outline',
    iconColor: colors.primaryLight,
    iconBg: colors.primaryLight + '12',
  },
  {
    id: '7',
    name: 'Wall Painting',
    category: 'Painting',
    rating: 4.7,
    reviews: 320,
    price: '₹12/sqft',
    deliveryTime: 'Schedule',
    icon: 'color-palette-outline',
    iconColor: colors.danger,
    iconBg: colors.danger + '12',
  },
  {
    id: '8',
    name: 'Grocery Delivery',
    category: 'Grocery',
    rating: 4.9,
    reviews: 5600,
    price: '₹49 fee',
    deliveryTime: '30 min',
    tag: 'Popular',
    tagColor: colors.success,
    icon: 'bag-handle-outline',
    iconColor: colors.success,
    iconBg: colors.success + '12',
    isPopular: true,
  },
];

const categories: Category[] = [
  { id: 'all', name: 'All', icon: 'apps-outline', color: colors.primary, bg: colors.primary + '15' },
  { id: 'cleaning', name: 'Cleaning', icon: 'sparkles-outline', color: colors.primary, bg: colors.primary + '12' },
  { id: 'plumbing', name: 'Plumbing', icon: 'water-outline', color: colors.driverAccent, bg: colors.driverAccent + '12' },
  { id: 'electrician', name: 'Electrician', icon: 'flash-outline', color: colors.warning, bg: colors.warning + '12' },
  { id: 'ac repair', name: 'AC Repair', icon: 'snow-outline', color: colors.primaryLight, bg: colors.primaryLight + '12' },
  { id: 'painting', name: 'Painting', icon: 'color-palette-outline', color: colors.danger, bg: colors.danger + '12' },
  { id: 'grocery', name: 'Grocery', icon: 'bag-handle-outline', color: colors.success, bg: colors.success + '12' },
];

const recentSearches: RecentSearch[] = [
  { id: '1', query: 'Home cleaning', type: 'service' },
  { id: '2', query: 'Plumber near me', type: 'service' },
  { id: '3', query: 'AC repair', type: 'service' },
  { id: '4', query: 'Ramesh Kumar', type: 'provider' },
];

const trendingSearches = [
  'Deep cleaning', 'AC service', 'Electrician', 'Plumber', 'Painting', 'Grocery',
];

type SortOption = 'relevance' | 'rating' | 'price_low' | 'price_high';

// ─── Result Card ──────────────────────────────────────────────────────────────

const ResultCard = ({ item }: { item: SearchResult }) => (
  <TouchableOpacity
    style={styles.resultCard}
    activeOpacity={0.82}
    onPress={() => router.push(`/(user)/service/${item.id}` as any)}
  >
    {/* Icon */}
    <View style={[styles.resultIcon, { backgroundColor: item.iconBg }]}>
      <Ionicons name={item.icon} size={24} color={item.iconColor} />
    </View>

    {/* Info */}
    <View style={styles.resultInfo}>
      <View style={styles.resultTopRow}>
        <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
        {item.tag && (
          <View style={[styles.resultTag, { backgroundColor: item.tagColor + '18' }]}>
            <Text style={[styles.resultTagText, { color: item.tagColor }]}>{item.tag}</Text>
          </View>
        )}
      </View>

      <Text style={styles.resultCategory}>{item.category}</Text>

      <View style={styles.resultMeta}>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color={colors.warning} />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviews.toLocaleString('en-IN')})</Text>
        </View>
        <View style={styles.metaDot} />
        <Ionicons name="time-outline" size={11} color={colors.textLight} />
        <Text style={styles.deliveryText}>{item.deliveryTime}</Text>
      </View>
    </View>

    {/* Price + CTA */}
    <View style={styles.resultRight}>
      <Text style={styles.resultPrice}>{item.price}</Text>
      <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
        <Text style={styles.bookBtnText}>Book</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showSort, setShowSort] = useState(false);
  const [recentList, setRecentList] = useState<RecentSearch[]>(recentSearches);

  const isSearching = query.trim().length > 0;

  // Filter + sort results
  const filteredResults = useCallback(() => {
    let results = allResults.filter((r) => {
      const matchesCategory =
        activeCategory === 'all' ||
        r.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesQuery =
        !isSearching ||
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });

    switch (sortBy) {
      case 'rating':
        results = [...results].sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        results = [...results].sort((a, b) => {
          const pa = parseInt(a.price.replace(/[^\d]/g, '')) || 0;
          const pb = parseInt(b.price.replace(/[^\d]/g, '')) || 0;
          return pa - pb;
        });
        break;
      case 'price_high':
        results = [...results].sort((a, b) => {
          const pa = parseInt(a.price.replace(/[^\d]/g, '')) || 0;
          const pb = parseInt(b.price.replace(/[^\d]/g, '')) || 0;
          return pb - pa;
        });
        break;
    }
    return results;
  }, [query, activeCategory, sortBy, isSearching]);

  const results = filteredResults();

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  const handleRecentTap = (item: RecentSearch) => {
    setQuery(item.query);
    inputRef.current?.focus();
  };

  const removeRecent = (id: string) => {
    setRecentList((prev) => prev.filter((r) => r.id !== id));
  };

  const clearAll = () => setRecentList([]);

  const sortLabels: Record<SortOption, string> = {
    relevance: 'Relevance',
    rating: 'Top Rated',
    price_low: 'Price: Low to High',
    price_high: 'Price: High to Low',
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── SEARCH HEADER ── */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.searchInputWrap}>
          <Ionicons name="search-outline" size={18} color={isSearching ? colors.primary : colors.textLight} />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={handleSearch}
            placeholder="Search services, providers..."
            placeholderTextColor={colors.textLight}
            style={styles.searchInput}
            autoFocus
            returnKeyType="search"
          />
          {isSearching && (
            <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.sortBtn, showSort && { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}
          activeOpacity={0.8}
          onPress={() => setShowSort(!showSort)}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={showSort ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* ── SORT DROPDOWN ── */}
      {showSort && (
        <View style={styles.sortDropdown}>
          {(Object.keys(sortLabels) as SortOption[]).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => { setSortBy(key); setShowSort(false); }}
              style={[styles.sortOption, sortBy === key && styles.sortOptionActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.sortOptionText, sortBy === key && styles.sortOptionTextActive]}>
                {sortLabels[key]}
              </Text>
              {sortBy === key && (
                <Ionicons name="checkmark" size={16} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── CATEGORY PILLS ── */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                style={[styles.categoryPill, isActive && { backgroundColor: cat.color, borderColor: cat.color }]}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={cat.icon}
                  size={14}
                  color={isActive ? '#fff' : cat.color}
                />
                <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── CONTENT ── */}
      {!isSearching && activeCategory === 'all' ? (
        // ── EMPTY STATE: show recents + trending ──
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        >
          {/* Recent Searches */}
          {recentList.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearAll}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recentList}>
                {recentList.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.recentRow}
                    onPress={() => handleRecentTap(item)}
                    activeOpacity={0.78}
                  >
                    <View style={styles.recentIconWrap}>
                      <Ionicons
                        name={item.type === 'provider' ? 'person-outline' : 'time-outline'}
                        size={16}
                        color={colors.textSecondary}
                      />
                    </View>
                    <Text style={styles.recentText}>{item.query}</Text>
                    <TouchableOpacity
                      onPress={() => removeRecent(item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="close" size={16} color={colors.textLight} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Trending */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Now 🔥</Text>
            </View>
            <View style={styles.trendingWrap}>
              {trendingSearches.map((term, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.trendingChip}
                  onPress={() => setQuery(term)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trending-up-outline" size={13} color={colors.primary} />
                  <Text style={styles.trendingText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Popular Services */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Services</Text>
            </View>
            <View style={styles.popularGrid}>
              {allResults.filter((r) => r.isPopular).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.popularCard}
                  activeOpacity={0.82}
                  onPress={() => router.push(`/(user)/service/${item.id}` as any)}
                >
                  <View style={[styles.popularIcon, { backgroundColor: item.iconBg }]}>
                    <Ionicons name={item.icon} size={22} color={item.iconColor} />
                  </View>
                  <Text style={styles.popularName} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.popularBottom}>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={10} color={colors.warning} />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    <Text style={styles.popularPrice}>{item.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        // ── RESULTS ──
        <View style={styles.resultsContainer}>
          {/* Result count + sort label */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {results.length > 0 ? (
                <>{results.length} results {isSearching ? `for "${query}"` : ''}</>
              ) : (
                'No results found'
              )}
            </Text>
            <TouchableOpacity
              onPress={() => setShowSort(!showSort)}
              style={styles.sortLabel}
              activeOpacity={0.8}
            >
              <Ionicons name="swap-vertical-outline" size={14} color={colors.primary} />
              <Text style={styles.sortLabelText}>{sortLabels[sortBy]}</Text>
            </TouchableOpacity>
          </View>

          {results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ResultCard item={item} />}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
            />
          ) : (
            // No results state
            <View style={styles.noResults}>
              <View style={styles.noResultsIcon}>
                <Ionicons name="search-outline" size={40} color={colors.textLight} />
              </View>
              <Text style={styles.noResultsTitle}>No services found</Text>
              <Text style={styles.noResultsSub}>
                Try a different keyword or browse our categories
              </Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => { setQuery(''); setActiveCategory('all'); }}
                activeOpacity={0.85}
              >
                <Text style={styles.browseBtnText}>Browse All Services</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Search Header
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    flexShrink: 0,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    padding: 0,
  },
  sortBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    flexShrink: 0,
  },

  // Sort Dropdown
  sortDropdown: {
    position: 'absolute',
    top: 72,
    right: 16,
    zIndex: 100,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    minWidth: 200,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  sortOptionActive: {
    backgroundColor: colors.primary + '10',
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sortOptionTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },

  // Category pills
  categoryWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  categoryPillTextActive: {
    color: '#fff',
  },

  // Sections
  section: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
  },

  // Recent searches
  recentList: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recentIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // Trending
  trendingWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trendingText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // Popular grid
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  popularCard: {
    width: (SCREEN_WIDTH - 32 - 10) / 2,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    gap: 8,
  },
  popularIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
    lineHeight: 19,
  },
  popularBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  popularPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },

  // Results
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  sortLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '10',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sortLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },

  // Result card
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  resultIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resultInfo: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  resultTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
    flex: 1,
  },
  resultTag: {
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 2,
    flexShrink: 0,
  },
  resultTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  resultCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reviewCount: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textLight,
  },
  deliveryText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  resultRight: {
    alignItems: 'flex-end',
    gap: 8,
    flexShrink: 0,
  },
  resultPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  bookBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },

  // No results
  noResults: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingTop: 60,
  },
  noResultsIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  noResultsSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  browseBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 13,
  },
  browseBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});