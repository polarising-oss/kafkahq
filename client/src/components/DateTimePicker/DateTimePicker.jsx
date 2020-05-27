import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'react-datetime-bootstrap';
import moment from 'moment';

class DateTimePicker extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  };

  render = () => {
    return (
      <div className="datepickerwrapper">
        <DateTime
          pickerOptions={{
            format: 'DD/MM/YYYY hh:mm A',
            inline: true,
            sideBySide: true,
            icons: {
              next: 'fa fa-angle-right',
              previous: 'fa fa-angle-left',
              up: 'fa fa-angle-up',
              down: 'fa fa-angle-down'
            }
          }}
          input={false}
          onChange={date => {
            this.props.onChange && this.props.onChange(moment(date).format('DD/MM/YYYY hh:mm A'));
          }}
        />
      </div>
    );
  };
}

export default DateTimePicker;