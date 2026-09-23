// Vérifie si deux événements se chevauchent
export function areEventsOverlapping(event1, event2) {
    const start1 = parseFloat(event1.startTime);
    const end1 = parseFloat(event1.endTime);
    const start2 = parseFloat(event2.startTime);
    const end2 = parseFloat(event2.endTime);
  
    return !(end1 <= start2 || start1 >= end2); // Vérifie si les plages horaires se croisent
  }
  
  // Regroupe les événements qui se chevauchent
  export function groupOverlappingEvents(events) {
    const sortedEvents = [...events].sort((a, b) => parseFloat(a.startTime) - parseFloat(b.startTime));
    const groups = [];
    let currentGroup = [sortedEvents[0]];
  
    for (let i = 1; i < sortedEvents.length; i++) {
      const lastEventInGroup = currentGroup[currentGroup.length - 1];
      if (areEventsOverlapping(lastEventInGroup, sortedEvents[i])) {
        currentGroup.push(sortedEvents[i]);
      } else {
        groups.push(currentGroup);
        currentGroup = [sortedEvents[i]];
      }
    }
    groups.push(currentGroup);
    return groups;
  }