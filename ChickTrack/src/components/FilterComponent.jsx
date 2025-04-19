import React, { useState, useEffect } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import { Input, Select, DatePicker, Button, Row, Col } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FilterComponent = ({ columns, onFilter, initialData }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState([]);

  useEffect(() => {
    // Ensure initialData is an array before processing
    if (!Array.isArray(initialData)) {
      console.error('initialData must be an array');
      return;
    }

    // Generate filter options from table columns
    const options = columns.map(column => {
      const key = column.key?.toString() || column.dataIndex?.toString() || '';
      const label = column.title?.toString() || '';
      
      // For columns with specific data types
      if (key === 'date' || key.includes('date') || key.includes('Date')) {
        return { key, label, type: 'date-range' };
      }
      
      // For columns with enum-like data
      try {
        const uniqueValues = Array.from(
          new Set(
            initialData
              .map(item => {
                // Handle nested properties (e.g., 'feedSalesUnit.unitName')
                if (key.includes('.')) {
                  return key.split('.').reduce((obj, prop) => obj?.[prop], item);
                }
                return item[key];
              })
              .filter(value => value !== undefined && value !== null)
          )
        );
        
        if (uniqueValues.length > 0 && uniqueValues.length <= 10) {
          return {
            key,
            label,
            type: 'select',
            options: uniqueValues.map(value => ({ 
              value: value.toString(), 
              label: value.toString() 
            }))
          };
        }
      } catch (error) {
        console.error(`Error processing column ${key}:`, error);
      }
      
      // Default to text input
      return { key, label, type: 'text' };
    });
    
    setFilterOptions(options.filter(option => option.key)); // Filter out invalid options
  }, [columns, initialData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    onFilter(filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({});
    onFilter({});
    setShowFilters(false);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Button 
        icon={<FilterOutlined />} 
        onClick={() => setShowFilters(!showFilters)}
      >
        Filters
      </Button>
      
      {showFilters && (
        <div style={{ 
          background: '#fafafa', 
          padding: '10px', 
          marginTop: '8px', 
          borderRadius: '4px',
          border: '1px solid #d9d9d9'
        }}>
          <Row gutter={[5, 5]}>
            {filterOptions.map(option => (
              <Col key={option.key} xs={24} sm={12} md={8} lg={6}>
                <div>
                  <label style={{ display: 'flex', marginBottom: 4 }}>{option.label}</label>
                  {option.type === 'text' && (
                    <Input
                      style={{ width: '40%' }}
                      value={filters[option.key] || ''}
                      onChange={(e) => handleFilterChange(option.key, e.target.value)}
                      placeholder={`Filter by ${option.label}`}
                    />
                  )}
                  {option.type === 'select' && (
                    <Select
                      style={{ width: '40%' }}
                      value={filters[option.key]}
                      onChange={(value) => handleFilterChange(option.key, value)}
                      placeholder={`Select ${option.label}`}
                      allowClear
                    >
                      {option.options?.map(opt => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                  {option.type === 'date-range' && (
                    <RangePicker
                      style={{ width: '50%' }}
                      onChange={(dates) => handleFilterChange(option.key, dates)}
                    />
                  )}
                </div>
              </Col>
            ))}
          </Row>
          
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }} onClick={resetFilters}>
              Reset
            </Button>
            <Button type="primary" onClick={applyFilters}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;