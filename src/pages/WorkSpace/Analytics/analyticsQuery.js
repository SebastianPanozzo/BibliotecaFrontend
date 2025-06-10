export const analyticsQuery = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return [
        {
            "$match": {
                "type": "spa_appointment",
                "$expr": {
                    "$and": [
                        {
                            "$gte": [
                                "$duration.start",
                                {
                                    "$dateFromString": {
                                        "dateString": startOfMonth.toISOString()
                                    }
                                }
                            ]
                        },
                        {
                            "$lte": [
                                "$duration.end",
                                {
                                    "$dateFromString": {
                                        "dateString": startOfNextMonth.toISOString()
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "tags",
                "foreignField": "email",
                "as": "user",
                "pipeline": [
                    {
                        "$project": {
                            "name": true,
                            "last_name": true,
                            "email": true,
                            "image": true
                        }
                    }
                ]
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$project": {
                "status": 1,
                "user": 1,
                "services": "$props.services",
                "professional": "$props.professional",
                "discount": "$props.discount"
            }
        }
    ]
}