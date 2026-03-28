import React, { useState } from 'react';
import PhoneFilterToggle from '../ui/PhoneFilterToggle';
import NotificationToggle from '../ui/NotificationToggle';

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onClear: () => void;
  phoneFilter?: boolean;
  onTogglePhoneFilter?: () => void;
  notificationsEnabled?: boolean;
  onToggleNotifications?: () => void;
  loading?: boolean;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  phoneFilter = false,
  onTogglePhoneFilter,
  notificationsEnabled = false,
  onToggleNotifications,
  loading = false,
}) => {


  return (
    <div className="flex flex-nowrap items-center gap-3">
      {/* Toggle Controls */}
      {(onTogglePhoneFilter || onToggleNotifications) && (
        <>
          {/* Phone Filter Toggle */}
          {onTogglePhoneFilter && (
            <PhoneFilterToggle
              isEnabled={phoneFilter}
              onToggle={onTogglePhoneFilter}
              disabled={loading}
            />
          )}

          {/* Notification Toggle */}
          {onToggleNotifications && (
            <NotificationToggle
              isEnabled={notificationsEnabled}
              onToggle={onToggleNotifications}
              disabled={loading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DateRangeFilter;
