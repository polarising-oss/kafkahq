import React from 'react';
import PropTypes from 'prop-types';
import Input from '../Form/Input';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { Clock, Calendar } from 'material-ui-next-pickers';
import { DateTimePicker } from '@material-ui/pickers';
import moment from 'moment';
import { formatDateTime } from '../../utils/converters';

const customTheme = createMuiTheme({
  overrides: {
    MuiPickersBasePicker: {
      pickerView: {
        backgroundColor: '#333333'
      }
    },
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: 'black'
      }
    },
    MuiTab: {
      textColorInherit: {
        backgroundColor: 'black',
        borderColor: 'black'
      }
    },
    MuiTabs: {
      indicator: {
        backgroundColor: '#ecbb13'
      }
    },
    MuiPickerDTTabs: {
      tabs: {
        backgroundColor: 'black'
      }
    },

    MuiTypography: {
      root: {
        color: 'white'
      },
      caption: {
        color: 'white'
      }
    },

    MuiPickersCalendarHeader: {
      daysHeader: {
        color: 'white'
      },
      dayLabel: {
        color: 'white'
      },
      iconButton: {
        backgroundColor: '#333333',
        color: 'white'
      }
    },

    MuiPickersClock: {
      pin: {
        backgroundColor: '#005f81'
      }
    },
    MuiPickersClockPointer: {
      pointer: {
        backgroundColor: '#005f81'
      },
      thumb: {
        backgroundColor: '#005f81',
        borderColor: '#005f81'
      },
      noPoint: {
        backgroundColor: 'rgba(0,95,129,0.3)',
        color: 'white'
      }
    },
    MuiPickersClockNumber: {
      clockNumber: {
        color: 'white'
      },
      clockNumberSelected: {
        backgroundColor: '#005f81',
        color: 'white'
      }
    },
    MuiButton: {
      textPrimary: {
        color: '#005f81'
      }
    },

    MuiDialogActions: {
      root: {
        backgroundColor: '#333333'
      }
    },

    MuiPickersDay: {
      day: {
        color: 'white',
        backgroundColor: '#333333'
      },
      container: {
        backgroundColor: 'black'
      },
      daySelected: {
        backgroundColor: 'black',
        color: 'white',
        hover: {
          backgroundColor: '#005f81'
        }
      },

      dayDisabled: {
        color: 'white'
      },
      current: {
        color: '',
        backgroundColor: ''
      }
    }
  }
});

class DatePicker extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  };

  state = {
    value: new Date(),
    openDateModal: false
  };

  componentDidMount = () => {
    this.setState({ value: this.props.value });
  };

  onChange = value => {
    this.setState({ value }, () => {
      this.props.onChange && this.props.onChange(value);
    });
  };

  onTimeChange = () => {};

  getDisplayValue = value => {
    try {
      return formatDateTime(
        {
          year: value.year(),
          monthValue: value.month(),
          dayOfMonth: value.date(),
          hour: value.hour(),
          minute: value.minute(),
          second: value.second()
        },
        'DD-MM-YYYY HH:mm'
      );
    } catch (e) {
      return '';
    }
  };

  render = () => {
    const { value, openDateModal } = this.state;
    const { name, label, error } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Clock
          classes={{
            root: 'clock-root',
            digitalContainer: 'clock-container',
            hand: 'clock-hand'
          }}
          onChange={value => {
            console.log('clock', value);
          }}
          value={new Date()}
        />
        <div
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}
        >
          <Calendar value={new Date()} />
        </div>
      </div>
      // <MuiThemeProvider theme={customTheme}>

      // </MuiThemeProvider>
    );
  };
}

export default DatePicker;
